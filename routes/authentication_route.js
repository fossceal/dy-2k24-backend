const userRouter = require('express').Router();

const {
    createUser, loginUser, logoutUser, getUser
} = require('../controllers/authentication_controller');
const { authorizeRoles, isAuthenticatedUser } = require('../middlewares/auth');

userRouter.post('/createUser', createUser);

userRouter.post('/loginUser', loginUser);

userRouter.get('/logoutUser', logoutUser);

userRouter.get('/me', isAuthenticatedUser, authorizeRoles("user", "admin"), getUser);

module.exports = userRouter;