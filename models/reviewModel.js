const mongoose = require('mongoose');
const Tour = require('./tourModel');

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
});

// calculate the average and total rating for a tour
reviewSchema.statics.calculateAverageRating = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                numRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        },
    ]);

    await Tour.findByIdAndUpdate(tourId, {
        ratingsAverage: stats.length > 0 ? stats[0].avgRating : 4.5,
        ratingsQuantity: stats.length > 0 ? stats[0].numRating : 0
    });
}

// calls the function to update avg and total rating after update and create of review
reviewSchema.post(/save|^findOneAnd/, async (doc) => {
    await doc.constructor.calculateAverageRating(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;