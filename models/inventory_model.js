const mongoose = require('mongoose');

const inventoryModel = new mongoose.Schema({
    user_id: {
        type: mongoose.ObjectId,
        ref: "User"
    },
    purchased_items_id: {
        type: mongoose.ObjectId,
        ref: "PurchasedItems"
    },
    transaction_id: {
        type: String
    },
    payment_screenshot: {
        type: String
    },
    referral_id: {
        type: String
    },
    verified_purchase: {
        type: Boolean,
        default: false
    }
});

const Inventory = mongoose.model('Inventory', inventoryModel);
module.exports = Inventory;