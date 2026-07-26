const express = require("express");
const morgan = require("morgan");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize')

const AppError = require("./utils/appError");
const globalErrorHandler = require('./controller/errorController');
const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

//Global middlewares

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); //for logging
}

const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests...Please try again after 1 hour'
})

app.use('/api', limiter)

app.use(express.json({limit: '30kb'})); //for payload from client

//data sanitization against NoSQL injection
app.use(mongoSanitize());

//custom middleware

app.use((req, res, next) => {
  console.log("from custom middleware");
  next();
});

//routes

app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);

// undefined routes
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   statusCode: 404,
  //   message: `Can't find route ${req.originalUrl}`,
  // });
  // const err = new Error(`Can't find route ${req.originalUrl}`);
  // err.status = "fail";
  // err.statusCode = 404;
  // next(err);
  next(new AppError(`Can't find route ${req.originalUrl}`, 404));
});

//Error handling middleware

app.use(globalErrorHandler);

module.exports = app;
