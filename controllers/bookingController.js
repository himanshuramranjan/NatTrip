const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const commonController = require('./commonController');
const catchAsyncError = require('../utils/catchAsyncError');

// Add user and tour details to the req body
exports.setTripAndUser = catchAsyncError(async (req, res, next) => {

    const tour = await Tour.findById(req.params.tourId);

    // if price and trip start date not provided
    if(!req.body.price) req.body.price = tour.price;
    if(!req.body.tripDate && tour.startDates) req.body.tripDate = tour.startDates[0];

    req.body.user = req.user._id;
    req.body.tour = req.params.tourId;
    next();
});

// Get all the bookings details
exports.getAllBookings = commonController.getAll(Booking);

// Get a booking
exports.getBooking = commonController.getOne(Booking);

// Create a new booking
exports.createBooking = commonController.createOne(Booking);

// Update a booking
exports.updateBooking = (req, res, next) => {

    res.status(500).json({
        status: 'error',
        message: 'Route not defined !'
    });
}

// Cancel a booking
exports.cancelBooking =  commonController.deleteOne(Booking);