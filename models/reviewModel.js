const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review:{
        type: String,
        required: [true, 'Review cant be empty'],
        trim: true
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be above or equal to 1'],
        max: [5, 'Rating must be below or equal to 5']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must have an user']
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must have a tour']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true},
    toObject: { virtuals :true}
});

// populate user detail on reviews
reviewSchema.pre(/^find/, function(next) {

    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;