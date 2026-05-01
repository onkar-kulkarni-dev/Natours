// const fs = require("fs");

const catchAsync = require("./../utils/catchAsync");
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");

// const fileName = `${__dirname}/../dev-data/data/tours-simple.json`;

// const toursData = fs.readFileSync(fileName, "utf-8");
// const parsedData = JSON.parse(toursData);

// exports.checkId = (req, res, next, val) => {
//   const isIdPresent = parsedData[parsedData.length - 1].id >= val;
//   if (!isIdPresent) {
//     return res.status(404).json({
//       status: "fail",
//       statusCode: 404,
//       message: `Tour does not exists with id ${val}`,
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: "fail",
//       statusCode: 400,
//       message: "Missing mandatory fields either name or price",
//     });
//   }
//   next();
// };

exports.aliasTop5CheapTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "ratingsAverage price";
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  //Execute Query
  const apiFeatures = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await apiFeatures.query;

  res.status(200).json({
    status: "success",
    statusCode: 200,
    numberOfTours: tours.length,
    data: tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // const tour = await Tour.findOne({_id: req.params.id})
  res.status(200).json({
    status: "success",
    statusCode: 200,
    data: tour,
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    statusCode: 200,
    data: tour,
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    statusCode: 201,
    status: "success",
    tour: newTour,
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    statusCode: 200,
    data: tour,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.7 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        totalTours: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        reviewsCount: { $sum: "$ratingsQuantity" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: "EASY" } },
    // },
  ]);
  res.status(200).json({
    status: "success",
    statusCode: 200,
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; //short hand trick for converting to type Number
  const plans = await Tour.aggregate([
    {
      $unwind: "$startDates", //will work on array and for every item of array will return new record with value as item
    },
    {
      $match: {
        //will work as filter
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        totalTours: { $sum: 1 },
        tours: { $push: "$name" }, //creates array of names
      },
    },
    {
      $addFields: {
        //added month attribute
        month: "$_id",
      },
    },
    {
      $project: {
        //used to remove fields
        _id: 0,
      },
    },
    {
      $sort: { totalTours: -1 }, // desc order
    },
    {
      $limit: 12, //to limit the records, here for example 12 because of total months = 12
    },
  ]);
  res.status(200).json({
    status: "Success",
    statusCode: 200,
    data: {
      plans,
    },
  });
});
