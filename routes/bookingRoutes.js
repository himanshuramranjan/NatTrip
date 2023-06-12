const express = require('express');
const Booking = require('../models/bookingModel');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(bookingController.getAllBookings)
    .post(authController.protectRoute, 
        authController.restrictRoute('user'), 
        bookingController.setTripAndUser, 
        bookingController.createBooking
    );

// Protects all the following routes from un-authenticated req
router.use(authController.protectRoute);

router
    .route('/:id')
    .get(authController.validateOwner(Booking), bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(authController.validateOwner(Booking), bookingController.cancelBooking);

module.exports = router;

