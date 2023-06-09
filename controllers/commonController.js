const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/AppError');
const AppFeatures = require('../utils/AppFeatures');
const { populate } = require('../models/tourModel');

// Get All the docs
exports.getAll = Model => catchAsyncError(async (req, res, next) => {

    let filter = {};
    
    // filter out the given tour if Id is present
    if(req.params.tourId) filter = { tour: req.params.tourId };

    // apply the features for desired o/p
    const features = new AppFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
  
    const docs = await features.query;
  
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        docs,
      },
    });
});

// Get a single doc
exports.getOne = (Model, populateOption) => catchAsyncError(async (req, res, next) => {

    let query = Model.findById(req.params.id);

    // check if virutal field need to be populated
    if(populateOption) query.populate(populateOption);

    const doc = await query;

    if(!doc) {
        return next(new AppError(`No doc w/ Id: ${req.params.id} exist`, 404));
    }
  
    return res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
});

// Create a new doc
exports.createOne = Model => catchAsyncError(async (req, res, next) => {

    const doc = await Model.create(req.body);
  
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
});

// Update the doc
exports.updateOne = Model => catchAsyncError(async (req, res, next) => {

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if(!doc) {
        return next(new AppError(`No Doc w/ Id: ${req.params.id} exist`, 404));
    }
  
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

// delete the doc
exports.deleteOne = Model => catchAsyncError(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc) {
      return next(new AppError(`No doc w/ Id: ${req.params.id} exist`, 404));
    }
  
    res.status(201).json({
      status: "success",
      message: "Doc Deleted Successfully"
    });
});