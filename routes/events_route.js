const eventsRouter = require('express').Router();
const multer = require('multer');

const { storage } = require('../middlewares/upload');
const {
    createEvent, getAllEvents, getEvent, updateEvent, deleteEvent, getPaginatedEvents
} = require('../controllers/events_controller');

const uploadStorage = multer({ storage: storage });

const { authorizeRoles, isAuthenticatedUser } = require('../middlewares/auth');
const { events } = require('../models/user_model');

eventsRouter.post('/createEvent', isAuthenticatedUser, authorizeRoles("user", "admin"), uploadStorage.single("file"), createEvent);

eventsRouter.get('/getAllEvents', isAuthenticatedUser, authorizeRoles("user", "admin"), getAllEvents);

eventsRouter.get('/getEvent/:id', isAuthenticatedUser, authorizeRoles("user", "admin"), getEvent);

eventsRouter.put('/updateEvent/:id', isAuthenticatedUser, authorizeRoles("user", "admin"), uploadStorage.single("file"), updateEvent);

eventsRouter.delete('/deleteEvent/:id', isAuthenticatedUser, authorizeRoles("user", "admin"), deleteEvent);

eventsRouter.get('/getPaginatedEvents', isAuthenticatedUser, authorizeRoles("user", "admin"), getPaginatedEvents);

//debug endpoints

// eventsRouter.post('/createEvent', uploadStorage.single("file"), createEvent);

// eventsRouter.get('/getAllEvents', getAllEvents);

// eventsRouter.get('/getEvent/:id', getEvent);

// eventsRouter.put('/updateEvent/:id', uploadStorage.single("file"), updateEvent);

// eventsRouter.delete('/deleteEvent/:id', deleteEvent);

module.exports = eventsRouter;