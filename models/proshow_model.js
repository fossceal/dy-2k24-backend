const mongoose = require("mongoose");

const proshowModel = new mongoose.Schema({
    email: String,
    phone: String,
    name: String,
    college: String,
    uniqueString: String,
});

const ProShow = mongoose.model("Proshow", proshowModel);

module.exports = ProShow;