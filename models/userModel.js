const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
            required: [true, "Please enter confirm password"],
            validate: {
                validator: function (el) {
                    return el === this.password;
                },
                message: 'Password not matching'
            }
        }
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    //if password is modified then only we need to run this...

    //hashing the password
    this.password = await bcrypt.hash(this.password, 12);

    //deleting confirmPassword field after encrypting password, no need to save this field in DB
    this.confirmPassword = undefined;
})

const Users = mongoose.model("Users", userSchema);

module.exports = Users;