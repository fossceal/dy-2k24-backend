const eventsRouter = require('express').Router();

const {
    createEvent, getAllEvents, getEvent, updateEvent, deleteEvent, getPaginatedEvents
} = require('../controllers/events_controller');

const upload = require("../middlewares/uploadPoster");

const { authorizeRoles, isAuthenticatedUser } = require('../middlewares/auth');

eventsRouter.post('/createEvent', isAuthenticatedUser, authorizeRoles("user", "admin"), upload.single("poster"), createEvent);

eventsRouter.get('/getAllEvents', isAuthenticatedUser, authorizeRoles("user", "admin"), getAllEvents);

eventsRouter.get('/getEvent/:id', isAuthenticatedUser, authorizeRoles("user", "admin"), getEvent);

eventsRouter.put('/updateEvent/:id', isAuthenticatedUser, authorizeRoles("user", "admin"), upload.single("poster"), updateEvent);

eventsRouter.delete('/deleteEvent/:id', isAuthenticatedUser, authorizeRoles("user", "admin"), deleteEvent);

eventsRouter.get('/getPaginatedEvents', isAuthenticatedUser, authorizeRoles("user", "admin"), getPaginatedEvents);

//debug endpoints

// eventsRouter.post('/createEvent', uploadStorage.single("file"), createEvent);

// eventsRouter.get('/getAllEvents', getAllEvents);

// eventsRouter.get('/getEvent/:id', getEvent);

// eventsRouter.put('/updateEvent/:id', uploadStorage.single("file"), updateEvent);

// eventsRouter.delete('/deleteEvent/:id', deleteEvent);

module.exports = eventsRouter;