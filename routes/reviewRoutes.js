const express = require('express');

const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/userController');
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

router.use(authController.protectRoute);

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(authController.validateOwner, reviewController.updateReview)
    .delete(authController.validateOwner, reviewController.deleteReview);

module.exports = router;


