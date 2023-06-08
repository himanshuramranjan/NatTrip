const express = require('express');
const tourController = require('../controllers/tourController');
const reviewRouter = require('./reviewRoutes');
const bookingRouter = require('./bookingRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);
router.use('/:tourId/bookings', bookingRouter);

router.get('/top-cheap-tours',
            tourController.getTopCheapTours, 
            tourController.getAllTours
        );

router.get('/tours-stats', tourController.getTourStats); 

router.get('/monthly-tour-plans/:year', tourController.getMonthlyTourPlans);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

router 
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);


module.exports = router;
