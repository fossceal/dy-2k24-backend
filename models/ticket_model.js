const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;