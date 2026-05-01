const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const errorHandlerDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    statusCode: err.statusCode,
    error: err,
    stack: err.stack,
  });
};

const errorHandlerProd = (err, res) => {
  //Operational, trusted errors: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      statusCode: err.statusCode,
    });
    //Programming or other unknown errors
  } else {
    console.error("Error 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
      statusCode: 500,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";

  if (!process.env.NODE_ENV == "development") {
    errorHandlerDev(err, res);
  } else {
    let error = JSON.parse(JSON.stringify(err));
    if (error.name == "CastError") error = handleCastErrorDB(error);
    errorHandlerProd(error, res);
  }
  next();
};
