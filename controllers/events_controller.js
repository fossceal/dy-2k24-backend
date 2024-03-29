const event = require('../models/events_model');
const fs = require('fs');

exports.createEvent = async (req, res) => {
    try {
        const { name, datetime, description, location, rules, amount } = req.body;

        const imageFileRemotePath = process.env.ENVIRONMENT === "DEVELOPMENT" ? "http://localhost:3000/uploads/" + req.file.filename : `${process.env.PRODUCTION_SERVER_URL}/uploads/` + req.file.filename;

        const newEvent = await event.create({
            name: name,
            datetime: datetime,
            description: description,
            location: location,
            rules: rules,
            amount: amount,
            poster: imageFileRemotePath
        });

        res.status(201).json({ success: true, message: 'Event created successfully', data: newEvent });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await event.find();
        res.status(200).json({ success: true, data: events });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getEvent = async (req, res) => {
    try {
        const eventID = req.params.id;
        const eventDetails = await event.findOne({ _id: eventID });
        if (!eventDetails) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.status(200).json({ success: true, data: eventDetails });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const eventID = req.params.id;

        const updatedEvent = await event.findOne({ _id: eventID });

        if (!updatedEvent) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (req.file) {
            const imageFileRemotePath = process.env.ENVIRONMENT === "DEVELOPMENT" ? "http://localhost:3000/uploads/" + req.file.filename : `${process.env.PRODUCTION_SERVER_URL}/uploads/` + req.file.filename;
            const previousPoster = updatedEvent.poster;
            const previousPosterPath = previousPoster.split('/').pop();

            fs.unlink(`./public/uploads/${previousPosterPath}`, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ success: false, message: err.message });
                } else {
                    console.log(`Deleted file: ./public/uploads/${previousPosterPath}`);
                }
            });

            updatedEvent.poster = imageFileRemotePath;
            await updatedEvent.save();
        }

        const newData = await event.findOneAndUpdate({ _id: eventID }, req.body, { new: true });

        res.status(200).json({ success: true, message: 'Event updated successfully', data: newData });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const eventID = req.params.id;
        const deletedEvent = await event.findOne({ _id: eventID });

        if (!deletedEvent) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        const previousPoster = deletedEvent.poster;
        const previousPosterPath = previousPoster.split('/').pop();

        fs.unlink(`./public/uploads/${previousPosterPath}`, (err) => {
            if (err) {
                res.status(500).json({ success: false, message: err.message });
            } else {
                console.log(`Deleted file: ./public/uploads/${previousPosterPath}`);
            }
        });

        await event.deleteOne({ _id: eventID });

        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};