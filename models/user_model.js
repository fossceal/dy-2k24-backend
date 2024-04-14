const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    role: {
        type: String,
        default: 'user',
    },
    email: String,
    phone: String,
    college: String,
    year: String,
    isCompletedProfile: {
        type: Boolean,
        default: false,
    }
});

const User = mongoose.model('User', userModel);
module.exports = User;