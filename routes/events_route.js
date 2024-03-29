const eventsRouter = require('express').Router();
const multer = require('multer');

const { storage } = require('../middlewares/upload');
const {
    createEvent, getAllEvents, getEvent, updateEvent, deleteEvent
} = require('../controllers/events_controller');

const uploadStorage = multer({ storage: storage });

const { authorizeRoles, isAuthenticatedUser } = require('../middlewares/auth');

eventsRouter.post('/createEvent', isAuthenticatedUser, authorizeRoles("user", "admin"), uploadStorage.single("file"), createEvent);

eventsRouter.get('/getAllEvents', isAuthenticatedUser, authorizeRoles("user", "admin"), getAllEvents);

eventsRouter.get('/getEvent/:id', isAuthenticatedUser, authorizeRoles("user", "admin"), getEvent);

eventsRouter.put('/updateEvent/:id', isAuthenticatedUser, authorizeRoles("user", "admin"), uploadStorage.single("file"), updateEvent);

eventsRouter.delete('/deleteEvent/:id', isAuthenticatedUser, authorizeRoles("user", "admin"), deleteEvent);

module.exports = eventsRouter;