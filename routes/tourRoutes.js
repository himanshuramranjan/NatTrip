const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router
    .route('/top-cheap-tours')
    .get(
        tourController.getTopCheapTours, 
        tourController.getAllTours
    );

router
    .route('/tours-stats')
    .get(tourController.getTourStats); 

router
    .route('/monthly-tour-plans/:year')
    .get(tourController.getMonthlyTourPlans);

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
