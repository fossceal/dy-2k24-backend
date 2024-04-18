const userRouter = require('express').Router();

const {
    createUser, loginUser, logoutUser, getUser, completeProfile, isCompleteProfile, loginAdmin
} = require('../controllers/authentication_controller');

const { authorizeRoles, isAuthenticatedUser } = require('../middlewares/auth');

userRouter.post('/createUser', createUser);

userRouter.post('/loginUser', loginUser);

userRouter.get('/logoutUser', logoutUser);

userRouter.get('/me', isAuthenticatedUser, authorizeRoles("user", "admin"), getUser);

userRouter.put('/completeProfile', isAuthenticatedUser, authorizeRoles("user"), completeProfile);

userRouter.get('/isCompleteProfile', isAuthenticatedUser, authorizeRoles("user"), isCompleteProfile);

userRouter.post('/loginAdmin', loginAdmin);

module.exports = userRouter;