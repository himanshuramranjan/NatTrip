const express = require('express');

const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/userController');
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protectRoute, reviewController.getUserAndTourId, reviewController.createReview);

module.exports = router;


