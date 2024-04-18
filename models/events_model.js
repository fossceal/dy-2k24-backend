const mongoose = require('mongoose');

const eventsModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    datetime: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    rules: {
        type: String,
        required: true,
    },
    poster: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    theme: {
        type: String,
        required: true,
    }
});

const Event = mongoose.model('Event', eventsModel);
module.exports = Event;