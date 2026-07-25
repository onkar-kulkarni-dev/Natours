const crypto = require('crypto');
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
        role: {
            type: String,
            default: "user",
            enum: ["user", "admin", "lead-guide", "guide"]
        },
        password: {
            type: String,
            required: true,
            minlength: [8, "Password should contain at least 8 characters"],
            select: false //no need to return this para to user, if we need to return then we need to add- select('+password') where ever required
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
        },
        passwordChangedAt: Date,
        resetPasswordToken: String,
        resetPasswordTokenExpiry: Date,
        isActive: {
            type: Boolean,
            default: true,
            select: false
        }
    }
);

userSchema.pre('save', async function (next) {
    // if (!this.isModified("password")) return next(); check this issue when next() is there then getting error from forgotPassword middleware
    if (!this.isModified("password")) return;
    //if password is modified then only we need to run this...

    //hashing the password
    this.password = await bcrypt.hash(this.password, 12);

    //deleting confirmPassword field after encrypting password, no need to save this field in DB
    this.confirmPassword = undefined;
})

userSchema.pre('save', function () {
    if (!(this.isModified('password')) || this.isNew) return;

    this.passwordChangedAt = Date.now() - 1000;//subtracting 1 second here due to jwt token gets created immediately and after that it gets saved into DB
})

//filter in-active users
userSchema.pre(/^find/, function () {
    this.find({ isActive: true })
})

//instance method is available for all documents, we can use below "correctPassword" method on all documents
userSchema.methods.correctPassword = async function (userPassword, orgPassword) {
    return await bcrypt.compare(userPassword, orgPassword)
}

//another instance method - 
userSchema.methods.isPasswordChanged = function (tokenCreatedTime) {
    if (this.passwordChangedAt) {
        const timeInSeconds = this.passwordChangedAt.getTime() / 1000;
        return tokenCreatedTime < timeInSeconds
    }
    return false;
}

userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordTokenExpiry = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const Users = mongoose.model("Users", userSchema);

module.exports = Users;