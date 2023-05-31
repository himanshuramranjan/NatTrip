const Tour = require("../models/tourModel");
const AppFeatures = require("../utils/AppFeatures");
const catchAsyncError = require("../utils/catchAsyncError");

// Get top cheap tours
exports.getTopCheapTours = (req, res, next) => {

  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,duration,ratingsAverage,difficulty";
  req.query.limit = "5";

  next();
};

// Get all the tour details
exports.getAllTours = catchAsyncError(async (req, res, next) => {

  const features = new AppFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  return res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

// Get a given tour detail
exports.getTour = catchAsyncError(async (req, res, next) => {

  const tour = await Tour.find(req.params.id);

  return res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

// Create a new tour
exports.createTour = catchAsyncError(async (req, res,next) => {

  const tour = await Tour.create(req.body);

  return res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

// Update a new tour
exports.updateTour = catchAsyncError(async (req, res, next) => {

  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(201).json({
    status: "success",
    data: {
      tour,
    },
  });
});

// Delete a tour
exports.deleteTour = catchAsyncError(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);

  return res.status(201).json({
    status: "success",
  });
});

// Get tour stats based on difficulty
exports.getTourStats = catchAsyncError(async (req, res, next) => {

  // aggregate pipeline to get the tour stats
  const stats = await Tour.aggregate([
    {
      $match: { privateTour: { $ne: true } },
    },
    {
      $group: {
        _id: "$difficulty",
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgRating: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

// Get monthly tour plans
exports.getMonthlyTourPlans = catchAsyncError(async (req, res, next) => {

  const year = req.params.year * 1;

  // aggregate pipeline to get the monthly plans
  const plans = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTours: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $sort: { numTours: -1 },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plans,
    },
  });
});
