const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();

        return res.status(200).json({
            status: 'success',
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

exports.createTour = async (req, res) => {
    try {
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