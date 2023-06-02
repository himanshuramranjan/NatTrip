const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');

const signInToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    });
}

const sendJWTToken = (res, user, statusCode) => {

    const token = signInToken(user._id);

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

exports.signup = catchAsyncError(async (req, res, next) => {
    
    const user = await User.create(req.body); //[restrict role in pre save middleware]

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
})