const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');
const catchAsync = require("../utils/catchAsync");

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await Users.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TOKEN_EXPIRES_IN
    })

    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser
        }
    })
});