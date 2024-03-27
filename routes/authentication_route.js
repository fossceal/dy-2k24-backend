const userRouter = require('express').Router();

const {
    createUser, loginUser, logoutUser
} = require('../controllers/authentication_controller');

adminRouter.post('/createUser', createUser);

adminRouter.post('/loginUser', loginUser);

adminRouter.get('/logoutAdmin', logoutUser);

module.exports = userRouter;