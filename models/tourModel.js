const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxLength: [40, 'A tour name must be less or equal to 40 chars'], 
        minLength: [5, 'A tour name must be greater or equal to 5 chars'], 
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['difficult', 'medium', 'easy'],
            message: 'Choose difficulty from easy, medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above or equal to 1'],
        max: [5, 'Rating must be below or equal to 5'],
        set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                return this.price >= val;
            },
            message: 'Discount cant be greater than the original price'
        }
    },
    summary: {
        type: String, 
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    privateTour: {
        type: Boolean,
        default: false
    },
    startDates: [Date],
    guides: [ 
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, {
    toJSON: { virtuals: true},
    toObject: { virtuals :true}
});

// virutal field to show duration of tour in weeks
tourSchema.virtual('durationWeeks').get(function() {

    if(!this.duration) return;

    let durationInWeeks = (this.duration / 7) * 100;
    return Math.round(durationInWeeks) / 100;
});

// pre-find (query) hook to hide private tours
tourSchema.pre(/^find/, function(next) {
    this.find({ privateTour: { $ne: true }});
    next();
});

// populate the guide details for the tour
tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: 'name photo'
    });
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;