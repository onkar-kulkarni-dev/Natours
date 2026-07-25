const Users = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await Users.find();

  res.status(200).json({
    status: "success",
    data: {
      users
    }
  })
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('To update password use path: /updatePassword', 401))
  }
  const filteredFields = filterObj(req.body, 'name', 'email')
  const updatedUser = await Users.findByIdAndUpdate(req.user._id, filteredFields, {
    new: true,
    runValidators: true
  })
  res.status(200).json({
    status: "success",
    data: {
      updatedUser
    }
  })
})

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
