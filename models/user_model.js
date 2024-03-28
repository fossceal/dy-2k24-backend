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
    }
});

const User = mongoose.model('User', userModel);
module.exports = User;