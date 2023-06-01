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
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide valid mail ID']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: [8, 'Password should have alteast 8 chars']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please provide password']
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;