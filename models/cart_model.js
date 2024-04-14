const mongoose = require('mongoose');

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
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    }
}, {
    timestamps: true
});

cartSchema.post('save', async function () {

    this.cartItems.forEach(async (item) => {
        const event = await Event.findOne({ _id: item.event });

        if (!event) {
            return;
        }

        this.totalPrice += event.amount;
    });

    await this.save();

});

const Cart = mongoose.model('Cart', cartSchema);