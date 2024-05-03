const mongoose = require('mongoose');
const Event = require("./events_model");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartItems: [
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
    merchItems: [
        {
            merch_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Merch',
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

cartSchema.pre('save', async function (next) {
    let cart = this;
    let totalPrice = 0;
    let merchPrice = 399;
    for (let i = 0; i < cart.cartItems.length; i++) {
        let event = await Event.findById(cart.cartItems[i].event);
        totalPrice += event.amount * cart.cartItems[i].quantity;
    }
    for (let i = 0; i < cart.merchItems.length; i++) {
        totalPrice += cart.merchItems[i].quantity * merchPrice;
    }
    cart.totalPrice = totalPrice;
    next();
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;