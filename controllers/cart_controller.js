const Cart = require('../models/cart_model');

exports.addItemToCart = async (req, res) => {
    try {
        const { event_id, quantity, price } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });

        const event = {
            event: event_id,
            quantity: quantity,
            price: price
        }

        if (cart) {
            const eventExist = cart.cartItems.find(c => c.event == event_id);

            if (eventExist) {
                return res.status(400).json({ success: false, message: 'Event already added to cart' });
            }

            cart.cartItems.push(event);
            await cart.save();
            return res.status(200).json({ success: true, message: 'Event added to cart' });
        }

        const newCart = await Cart.create({
            user: req.user._id,
            cartItems: [event]
        });

        res.status(201).json({ success: true, message: 'Event added to cart' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};