const { promisify } = require('util');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');

// Send jwt token after its creation
const sendJWTToken = (res, user, statusCode) => {

    const token = user.signInToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.cookie('jwt', token, cookieOptions);

    // hides the password and active field
    user.password = undefined;
    user.active = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

// Signs up a new user
exports.signup = catchAsyncError(async (req, res, next) => {
    
    // providing the fields to prevent admin access to users
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    }); 

    sendJWTToken(res, user, 201);
});

// Logs in a existing user
exports.login = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;

    // Checked the email and password
    if(!email || !password) {
        return next(new AppError(`Please provide valid email and password`, 400));
    }

    // find the user based on provided credentials
    const user = await User.findOne({email}).select('+password');

    // returns error if no user exist
    if(!user || !(await user.isCorrectPassword(password, user.password))) {
        return next(new AppError(`Incorrect name or password`, 401));
    }

    // send jwt token if user exist
    sendJWTToken(res, user, 200);
});

// Log out the user
exports.logout = catchAsyncError(async (req, res, next) => {

    const token = req.user.signOutToken(req.user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + 10 * 1000
        ),
        httpOnly: true
    }

    res.cookie('jwt', token, cookieOptions);

    res.status(200).json({
        status: 'success',
        token
    })
});

// Protect routes from un-authenticated req
exports.protectRoute = catchAsyncError(async (req, res, next) => {

    // checks for jwt token
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return next(new AppError('You are not logged in', 401));
    }

    // decode the jwt token to get the userId
    let token = req.headers.authorization.split(' ')[1];
    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

    // check for existing user
    const existingUser = await User.findById(decodedToken.id);

    // if no user exist w/ given id
    if(!existingUser) {
        return next(new AppError('The user no longer exist', 401))
    }

    // check if user has changed its password
    if(existingUser.isPasswordChanged(decodedToken.iat)) {
        return next(new AppError('You changed your password ! Please login again', 401));
    }

    // pass the existing user to the req
    req.user = existingUser;
    next();
});

// Protect routes from un-authorized req
exports.restrictRoute = (...roles) => {
    return (req, res, next) => {

        // checks if req has roles for the action
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You are not authorized for this action', 403));
        }
        next();
    }
}

// Create token if user forgot thier password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {

    // get the user based on mail ID
    const user = await User.findOne({email: req.body.email});

    // if no user exist
    if(!user) {
        return next(new AppError('No user exist with given mail ID', 404));
    }

    // create reset token
    let resetToken = user.createPasswordResetToken();

    // encrypt the token
    const hashedToken = user.encryptToken(resetToken);
    
    // save the token and set its expiry
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + (10 * 60 * 1000);

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        resetToken
    });
})

// Reset the password based on token sent to email
exports.resetPassword = catchAsyncError(async (req, res, next) => {

    // encrypt the token
    let user = new User();
    const hashedToken = user.encryptToken(req.params.token);

    // find the user based on token
    user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // check if token is valid
    if(!user) {
        return next(new AppError('Token is invalid or expired', 400));
    }

    // update the user fields
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save();

    sendJWTToken(res, user, 200);
});

// Update password for LoggedIn users
exports.updatePassword = catchAsyncError(async (req, res, next) => {

    // get the user based on Id
    const user = await User.findById(req.user.id).select('+password');

    // check for current password
    if(!req.body.currentPassword || !(await user.isCorrectPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Current password is not matching', 401));
    }

    // update the user password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    await user.save();

    sendJWTToken(res, user, 200);
})

// validate the owner of reviews
exports.validateOwner = Model => catchAsyncError(async (req, res, next) => {
    
    const doc = await Model.findById(req.params.id);

    if(!doc) {
        return next(new AppError(`No doc w/ Id: ${req.params.id} exist`, 404));
    }
    
    // check if current user is the owner of the review/booking
    if(!doc.user._id.equals(req.user.id)) {
        return next(new AppError('You are not authorized to access this doc', 403));
    }
    next();
});