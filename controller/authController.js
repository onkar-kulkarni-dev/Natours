const { promisify } = require('util');
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
        passwordChangedAt: req.body.passwordChangedAt
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

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(' ')[1]
    }
    //1. check for the token, if token is not there then return it
    if (!token) {
        return next(new AppError('You are not authorized user, please login!', 401))
    }
    //2. check for token is valid
    const tokenDetails = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //3. if token is valid, then check whether user exists or not
    const userDetails = await Users.findById(tokenDetails.id);
    if (!userDetails) {
        return next(new AppError('User does not exists', 401))
    }
    //4. check if password is changed or not
    if (userDetails.isPasswordChanged(tokenDetails.iat)) {
        return next(new AppError('Password changed, please login again...', 401))
    }
    //granting the access
    req.user =  userDetails;
    next();
})