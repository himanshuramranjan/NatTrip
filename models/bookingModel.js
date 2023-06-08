const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A booking must have user']
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'A booking must have tour']
    },
    price: {
        type: Number,
        required: [true, 'Price of booking is required'],
    },
    paid: {
        type: Boolean,
        default: true
    },
    tripDate: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

// populate the user and tour details for the booking
bookingSchema.pre(/^find/, function(next) {

    this.populate({
        path: 'user',
        select: 'name photo'
    }).populate({
        path: 'tour',
        select: 'name duration difficulty'
    });
    next();
})

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;