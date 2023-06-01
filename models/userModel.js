const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: [true, 'An account exist w/ same Email Id'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide valid mail ID']
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'guide'],
        default: 'user'
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: [8, 'Password should have alteast 8 chars']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please provide password'],
        validator: {
            validate: function(confirmPswd) {
                return this.password === confirmPswd;
            },
            message: 'Passwords are not matching'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;