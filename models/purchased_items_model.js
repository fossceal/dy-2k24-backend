const mongoose = require('mongoose');

const purchasedItemsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purchasedItems: [
        {
            event: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Event',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    }
}, {
    timestamps: true
});

const PurchasedItems = mongoose.model('PurchasedItems', purchasedItemsSchema);

module.exports = PurchasedItems;