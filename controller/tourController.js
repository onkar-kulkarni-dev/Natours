// const fs = require("fs");

const Tour = require("../models/tourModel");

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
  req.query.sort = 'ratingsAverage price';
  next()
}

exports.getAllTours = async (req, res) => {
  try {
    //1A: Filtering
    const queryObj = { ...req.query };
    const excludedParams = ["sort", "page", "fields", "limit"];
    excludedParams.forEach((param) => delete queryObj[param]);

    //1B: Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));
    //below way is risky here because we need dynamic filtering.
    // const query = Tour.find().where('duration').equals(queryObj.duration).where('difficulty').equals(queryObj.difficulty)

    //2: Sorting
    if (req.query.sort) {
      //this is for if there are matching records then we will use this, lets say we are doing sort by rice and 2 records has same price then we will pass ",averageRatings" so that then it will check for it and then send the response.
      const sortBy = req.query.sort.replace(/,/g, " ");
      query = query.sort(sortBy);
    } else {
      //default sorting by createdAt and in desc order(for desc order we use "-")
      query = query.sort("-createdAt");
    }

    //3: Fields limit
    if (req.query.fields) {
      const fields = req.query.fields.replace(/,/g, " ");
      query = query.select(fields);
    } else {
      //default case if we want to remove some fields, we use "-" to remove fields
      query = query.select("-__v");
    }

    //4: Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (page) {
      const totalDocs = await Tour.countDocuments();
      if (skip >= totalDocs) throw new Error("This page doesn't exists");
    }

    //Execute Query
    const tours = await query;

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
