const express = require("express");
const morgan = require("morgan");

const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

//middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); //for logging
}

app.use(express.json()); //for payload from client

//custom middleware

app.use((req, res, next) => {
  console.log("from custom middleware");
  next();
});

//routes

app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    statusCode: 404,
    message: `Can't find route ${req.originalUrl}`,
  });
  next();
});

module.exports = app;
