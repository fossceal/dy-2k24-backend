const Cart = require('../models/cart_model');

exports.addItemToCart = async (req, res) => {
    try {
        const { event_id, quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            const result = await Cart.create({ user: req.user._id, cartItems: [{ event: event_id, quantity: quantity }] });
        } else {
            cart.user = req.user._id;
            const event = cart.cartItems.find(item => item.event.toString() === event_id);

            if (event) {
                cart.cartItems.forEach(item => {
                    if (item.event.toString() === event_id) {
                        item.quantity = parseInt(item.quantity) + parseInt(quantity);
                    }
                });
            } else {
                cart.cartItems.push({ event: event_id, quantity: quantity });
            }

            await cart.save();
        }

        res.status(200).json({ success: true, message: 'Item added to cart successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getCartItems = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.event').exec();

        res.status(200).json({ success: true, cart });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const event_id = req.params.id;

        const cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            const index = cart.cartItems.findIndex(item => item.event.toString() === event_id);

            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Item not found in cart' });
            }

            if (index > -1) {
                cart.cartItems.splice(index, 1);
            }

            await cart.save();
        }

        res.status(200).json({ success: true, message: 'Item removed from cart successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

