const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const tokenGenerator = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TOKEN_EXPIRES_IN
    })
}

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await Users.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });

    const token = tokenGenerator(newUser._id)

    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser
        }
    })
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please enter email and password', 400));
    }

    const user = await Users.findOne({ email }).select('+password');

    //correctPassword method is instance method created in model
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401))
    }

    const token = tokenGenerator(user._id)

    res.status(200).json({
        status: "success",
        token
    })
});