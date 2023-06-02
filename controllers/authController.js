const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');

// Creates signIn token using jwt
const signInToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    });
}

// Creates signOut token using jwt
const signOutToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET_KEY, {
        expiresIn: '10s'
    });
}

// Send jwt token after its creation
const sendJWTToken = (res, user, statusCode) => {

    const token = signInToken(user._id);

    // hides the password and active field on signup
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

    const token = signOutToken(req.user._id);

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

// Reset the password based on token sent to email
exports.resetToken = catchAsyncError(async (req, res, next) => {

    // encrypt the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    // find the user based on token
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // check if token is valid
    if(!user) {
        return next(new AppError('Token is invalid or expired', 400));
    }

    // update the fields
    user.password = req.body.password;
    user.confirmPassword = req.body.password;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save();

    sendJWTToken(res, user, 200);
});

// Update password for LoggedIn users
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    
})