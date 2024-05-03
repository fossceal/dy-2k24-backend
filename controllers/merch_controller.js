const Cart = require("../models/cart_model");
const Merch = require("../models/merch_model");

exports.addMerchToCart = async (req, res) => {
    try {
        const { size, type, color, quantity } = req.body;

        const merch = await Merch.create({
            size: size,
            type: type,
            color: color
        });

        const cart = await Cart.findOne({ user: req.user.id });

        cart.merchItems.push({
            merch_id: merch._id,
            quantity: quantity
        });

        await cart.save();

        res.status(201).json({
            success: true,
            message: "Merch added to cart",
            data: merch
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.removeMerchFromCart = async (req, res) => {
    try {
        const merch_id = req.params.id;

        const cart = await Cart.findOne({ user: req.user.id });

        const index = cart.merchItems.findIndex(item => item.merch_id === merch_id);

        cart.merchItems.splice(index, 1);

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Merch removed from cart"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

