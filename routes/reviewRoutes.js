const express = require('express');

const Review = require('../models/reviewModel');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protectRoute, 
        authController.restrictRoute('user'), 
        reviewController.setUserAndTourId, 
        reviewController.createReview
        );

// Protects all the following routes from un-authenticated req
router.use(authController.protectRoute);

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(authController.validateOwner(Review), reviewController.updateReview)
    .delete(authController.validateOwner(Review), reviewController.deleteReview);

module.exports = router;


