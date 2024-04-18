const event = require('../models/events_model');
const fs = require('fs');

exports.createEvent = async (req, res) => {
    try {
        const { name, datetime, description, location, rules, amount, theme } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a Poster' });
        }

        const imageFileRemotePath = process.env.ENVIRONMENT === "DEVELOPMENT" ? `http://localhost:${process.env.PORT}/poster_images/` + req.file.filename : `${process.env.PRODUCTION_SERVER_URL}/poster_images/` + req.file.filename;

        const newEvent = await event.create({
            name: name,
            datetime: datetime,
            description: description,
            location: location,
            rules: rules,
            amount: amount,
            poster: imageFileRemotePath,
            theme: theme
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
            const imageFileRemotePath = process.env.ENVIRONMENT === "DEVELOPMENT" ? "http://localhost:3000/poster_images/" + req.file.filename : `${process.env.PRODUCTION_SERVER_URL}/poster_images/` + req.file.filename;
            const previousPoster = updatedEvent.poster;
            const previousPosterPath = previousPoster.split('/').pop();

            fs.unlink(`./public/poster_images/${previousPosterPath}`, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ success: false, message: err.message });
                } else {
                    console.log(`Deleted file: ./public/poster_images/${previousPosterPath}`);
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

        fs.unlink(`./public/poster_images/${previousPosterPath}`, (err) => {
            if (err) {
                res.status(500).json({ success: false, message: err.message });
            } else {
                console.log(`Deleted file: ./public/poster_images/${previousPosterPath}`);
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

exports.getPaginatedEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < await event.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        results.results = await event.find().limit(limit).skip(startIndex).exec();
        res.status(200).json({ success: true, data: results });


    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};