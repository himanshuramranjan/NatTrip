const crypto = require('crypto');

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
        minLength: [8, 'Password should have alteast 8 chars'],
        select: false
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
        default: true,
        select: false
    }
});

userSchema.pre('save', async function(next) {

    if(!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;

    next();
});

// compares the actual password with user's provided password
userSchema.methods.isCorrectPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

// checks if user has changed its password
userSchema.methods.isPasswordChanged = function(JWTTimeStamp) {

    // password not updated
    if(!this.passwordChangedAt) return false;

    // if password is updated
    const passwordChangedAtTimeStamp = parseInt(this.passwordChangedAt.geTime() / 1000, 10);

    return passwordChangedAtTimeStamp > JWTTimeStamp;
}

// create reset token
userSchema.methods.createPasswordResetToken = function() {

    const resetToken = crypto.randomBytes(32).toString('hex');

    return resetToken; 
 }

// encrypt the reset password token
userSchema.methods.encryptToken = token => {
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
}
const User = mongoose.model('User', userSchema);

module.exports = User;