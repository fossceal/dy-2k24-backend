const mongoose = require('mongoose');

const inventoryModel = new mongoose.Schema({
    user_id: {
        type: mongoose.ObjectId,
        ref: "User"
    },
    event_id: {
        type: mongoose.ObjectId,
        ref: "Event"
    },
    quantity: {
        type: Number
    }
});

const Inventory = mongoose.model('Inventory', inventoryModel);
module.exports = Inventory;