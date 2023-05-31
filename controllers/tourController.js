const Tour = require('../models/tourModel');
const AppFeatures = require('../utils/AppFeatures');

// Get top cheap tours
exports.getTopCheapTours = (req, res, next) =>{

    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,duration,ratingsAverage,difficulty';
    req.query.limit = '5';
    next();
}

exports.getAllTours = async (req, res) => {
    try {
        
        const features = new AppFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tours = await features.query;

        return res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch(err) {
        return res.status(401).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.find(req.params.id);

        return res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch(err) {
        return res.status(401).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.createTour = async (req, res) => {
    try {
        console.log('Inside the create method');
        const tour = await Tour.create(req.body);

        return res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch(err) {
        return res.status(401).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        return res.status(201).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch(err) {
        return res.status(401).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        return res.status(201).json({
            status: 'success'
        });
    } catch(err) {
        return res.status(401).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getTourStats = async (req, res) => {

    const stats = await Tour.aggregate([
        {
            $match: { privateTour: { $ne: true } }
        },
        {
            $group: {
                _id: '$difficulty',
                numTours: { $sum: 1},
                numRatings: { $sum: '$ratingsQuantity'},
                avgRating: { $avg: '$ratingsAverage'},
                avgPrice: { $avg: '$price'},
                minPrice: { $min: '$price'},
                maxPrice: { $max: '$price'}
            }
        },
        {
            $sort: { avgRating: 1 }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
}