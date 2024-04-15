const cartRouter = require('express').Router();

const { addItemToCart, getCartItems, removeFromCart } = require("../controllers/cart_controller");

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

cartRouter.post('/addItemToCart', isAuthenticatedUser, authorizeRoles('user', "admin"), addItemToCart);

cartRouter.get('/getCartItems', isAuthenticatedUser, authorizeRoles('user', "admin"), getCartItems);

cartRouter.delete('/removeFromCart/:id', isAuthenticatedUser, authorizeRoles('user', "admin"), removeFromCart);

module.exports = cartRouter;