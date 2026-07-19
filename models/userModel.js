const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please enter valid email"]
        },
        photo: {
            type: String,
        },
        password: {
            type: String,
            required: true,
            minlength: [8, "Password should contain at least 8 characters"]
        },
        confirmPassword: {
            type: String,
            required: true
        }
    }
);

const Users = mongoose.model("Users", userSchema);

module.exports = Users;