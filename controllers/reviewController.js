const Review = require('../models/reviewModel');
const commonController = require('./commonController');

// Add user and tour Id to the req body
exports.getUserAndTourId = (req, res, next) => {

    req.body.user = req.user._id;
    req.body.tour = req.params.tourId;
    next();
}

// Get all the reviews details
exports.getAllReviews = commonController.getAll(Review);

// Create a new review
exports.createReview = commonController.createOne(Review);