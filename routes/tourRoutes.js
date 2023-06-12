const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const bookingRouter = require('./bookingRoutes');

const router = express.Router();

// nested routing for reviews and bookings
router.use('/:tourId/reviews', reviewRouter);
router.use('/:tourId/bookings', bookingRouter);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(authController.restrictRoute('guide'), tourController.createTour);

// Protects all the following routes from un-authenticated req
router.use(authController.protectRoute);

router.get('/top-cheap-tours',
            tourController.getTopCheapTours, 
            tourController.getAllTours
        );

router 
    .route('/:id')
    .get(tourController.getTour);

// Protects all the below routes from un-authorized req
router.use(authController.restrictRoute('guide', 'admin'));

router 
    .route('/:id')
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

router.get('/tours-stats', tourController.getTourStats); 
router.get('/monthly-tour-plans/:year', tourController.getMonthlyTourPlans);

module.exports = router;
