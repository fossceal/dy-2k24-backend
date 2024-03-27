const mongoose = require('mongoose');

exports.connectDatabase = async (req, res) => {
    try {
        await mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_IP_ADDRESS}/${process.env.MONGO_DB_NAME}?authSource=admin`);
        console.log("Connected to database");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}