const Cart = require('../models/cart_model');
const Event = require('../models/events_model');
const Inventory = require('../models/inventory_model');
const PurchasedItems = require('../models/purchased_items_model');
var QRCode = require('qrcode');
const sendMail = require('../utils/sendMail');
const Ticket = require('../models/ticket_model');

exports.getCheckoutLink = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (cart.cartItems.length === 0) {
            res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        const payeeAddress = "anug1035-1@okhdfcbank";
        const payeeName = "DY%2024";
        const trxnNote = "Payment%20for%20event";
        const payeeAmount = cart.totalPrice;
        const currencyCode = "INR";
        const refUrl = "https://dakshayanthra.in";

        const UPI = "upi://pay?pa=" + payeeAddress + "&pn=" + payeeName + "&tn" + trxnNote + "&am=" + payeeAmount + "&cu=" + currencyCode + "&url=" + refUrl;

        QRCode.toBuffer(UPI, function (err, buffer) {
            res.status(200).json({ success: true, data: buffer, payment_link: UPI });
        });

        // res.status(400).json({ success: false, message: 'Internal server error' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

exports.checkoutDetailsUpload = async (req, res) => {
    try {
        const { transaction_id } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload screenshot of payment' });
        }

        const imagePath = process.env.ENVIRONMENT === "DEVELOPMENT" ? `http://localhost:${process.env.PORT}/payment_screenshots/` + req.file.filename : `${process.env.PRODUCTION_SERVER_URL}/payment_screenshots/` + req.file.filename;

        const cart = await Cart.findOne({ user: req.user._id });

        const purchasedItems = await PurchasedItems.create({
            user: req.user._id,
            purchasedItems: cart.cartItems,
            totalPrice: cart.totalPrice,
        });

        await Cart.deleteOne({ user: req.user._id });

        await Inventory.create({
            user_id: req.user._id,
            purchased_items_id: purchasedItems._id,
            transaction_id: transaction_id,
            payment_screenshot: imagePath
        });

        res.status(201).json({ success: true, message: 'Payment data uploaded successfully', data: purchasedItems });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getPaginatedInventories = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const verified = req.query.verified || false;

        const inventories = await Inventory.find({ verified_purchase: verified }).populate("user_id").populate({
            path: "purchased_items_id", populate: {
                path: "purchasedItems.event",
            }
        }).skip((page - 1) * limit).limit(limit);

        res.status(200).json({ success: true, data: inventories });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

exports.verifyPurchase = async (req, res) => {
    try {
        const inventory_id = req.params.id;

        const inventory = await Inventory.findOne({ _id: inventory_id }).populate("user_id").populate("purchased_items_id").populate("purchased_items_id.purchasedItems.event");

        if (!inventory) {
            return res.status(404).json({ success: false, message: 'Inventory not found' });
        }

        inventory.verified_purchase = true;

        await inventory.save();

        await inventory.purchased_items_id.purchasedItems.forEach(async (item) => {
            await Ticket.create({
                user_id: inventory.user_id,
                quantity: item.quantity,
                event_id: item.event
            });
        });

        const tickets = await Ticket.find({ user_id: inventory.user_id._id }).populate("event_id").exec();

        var ticketDetails = "";

        tickets.forEach(ticket => {
            const detail = {
                ticket_id: ticket._id,
                event_name: ticket.event_id.name,
                event_date: ticket.event_id.datetime,
                event_location: ticket.event_id.location,
                quantity: ticket.quantity,
            }
            ticketDetails += "Ticket ID: " + detail.ticket_id + "\nEvent Name: " + detail.event_name + "\nEvent Date: " + detail.event_date + "\nEvent Location: " + detail.event_location + "\nQuantity: " + detail.quantity + "\n\n";
        });

        console.log(ticketDetails);

        await sendMail.sendMail(inventory.user_id.email, "Purchase Verified", "Your purchase has been verified successfully. You can now attend the event.\n\n Event Details: " + ticketDetails, `<html><body><h1>Your purchase has been verified successfully. You can now attend the event.</h1><br><h2>Event Details:</h2><br><p>${ticketDetails}</p></body></html>`);

        res.status(200).json({ success: true, message: 'Purchase verified successfully', data: inventory });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



