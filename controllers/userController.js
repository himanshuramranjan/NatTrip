const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsyncError = require('../utils/catchAsyncError');
const commonController = require('./commonController');

// filters out the field which cant be updated
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};

    // loop thru each key and if its permissible add it to newObj
    Object.keys(obj).forEach(elm => {
        if(allowedFields.includes(elm)) newObj[elm] = obj[elm];
    });
    return newObj;
}

// Get all the user details
exports.getAllUsers = commonController.getAll(User);

// Get a given user detail
exports.getUser = commonController.getOne(User);

// Create a new user
exports.createUser = (req, res, next) => {

    res.status(500).json({
        status: 'error',
        message: 'Route not defined ! Please use /signup'
    });
}

// Update a new user
exports.updateUser = (req, res, next) => {

    res.status(500).json({
        status: 'error',
        message: 'Route not defined ! Only User can modify its data'
    });
}

// Delete a user
exports.deleteUser = commonController.deleteOne(User);

// Add logged in user id to the params
exports.getMe = (req, res, next) => {

    req.params.id = req.user.id;
    next();
}

// Filter out fields and add Id to the req
exports.updateMe = (req, res, next) => {
    
    if(req.body.password) {
        return next(new AppError('This route is not for updating password', 400));
    }

    req.body = filterObj(req.body, 'name', 'photo');
    req.params.id = req.user.id;

    next();
}

exports.deleteMe = (req, res, next) => {

    req.body = { active: false};
    req.params.id = req.user.id;

    next();
}