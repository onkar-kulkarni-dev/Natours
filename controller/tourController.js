// const fs = require("fs");

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

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findOne({_id: req.params.id})
    res.status(200).json({
      status: "success",
      statusCode: 200,
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      statusCode: 200,
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      statusCode: 201,
      status: "success",
      tour: newTour,
    });
  } catch (err) {
    console.log(err, "asd");
    res.status(400).json({
      status: "fail",
      statusCode: 400,
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      statusCode: 200,
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      statusCode: 404,
      message: err,
    });
  }
};
