const InventoryRouter = require('express').Router();

const { getCheckoutLink, checkoutDetailsUpload, getPaginatedInventories, verifyPurchase } = require("../controllers/inventory_controller");

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const uploadScreenshot = require("../middlewares/uploadPaymentScreenshot");

InventoryRouter.get('/getCheckoutLink', isAuthenticatedUser, authorizeRoles('user'), getCheckoutLink);

InventoryRouter.post('/checkoutDetailsUpload', isAuthenticatedUser, authorizeRoles('user'), uploadScreenshot.single("screenshot"), checkoutDetailsUpload);

InventoryRouter.get("/getPaginatedInventories", isAuthenticatedUser, authorizeRoles("user", "admin"), getPaginatedInventories);

InventoryRouter.put("/verifyPurchase/:id", isAuthenticatedUser, authorizeRoles("user", "admin"), verifyPurchase);

module.exports = InventoryRouter;