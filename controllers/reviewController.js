const Review = require('../models/reviewodel');
const commonController = require('./commonController');

exports.getAllReviews = commonController.getAll(Review);

exports.createReview = commonController.createOne(Review);