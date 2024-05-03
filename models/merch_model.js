const mongoose = require("mongoose");

const merchModel = new mongoose.Schema({
    size: Number,
    type: String,
    color: String
});

const Merch = mongoose.model("Merch", merchModel);

module.exports = Merch;