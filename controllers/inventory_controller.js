const Event = require('../models/events_model');
const Inventory = require('../models/inventory_model');

exports.addItem = async (req, res) => {
    try {
        const { item_id, quantity } = req.body;

        const event = await Event.findOne({ _id: item_id });

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        const user = req.user;

        const inventory = await Inventory.findOne({ user_id: user._id, event_id: item_id }, { _id: 0, __v: 0, payment_screenshot: 0, transaction_id: 0 }).populate("event_id");

        if (inventory) {
            return res.status(400).json({ success: false, message: 'You already enrolled for this event', event: inventory });
        }

        const newInventory = await Inventory.create({
            user_id: user._id,
            event_id: item_id,
            quantity: quantity
        });

        res.status(201).json({ success: true, message: 'Item added successfully', data: newInventory });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

