const Users = require('../models/userModel');
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await Users.find();

  res.status(200).json({
    status: "success",
    data: {
      users
    }
  })
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This path is yet to be defined!",
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This path is yet to be defined!",
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This path is yet to be defined!",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This path is yet to be defined!",
  });
};
