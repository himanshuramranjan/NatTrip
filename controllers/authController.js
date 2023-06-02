const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');

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

exports.signup = catchAsyncError(async(req, res, next) => {
    
    const user = await User.create(req.body); //[restrict role in pre save middleware]

    sendJWTToken(res, user, 201);
});