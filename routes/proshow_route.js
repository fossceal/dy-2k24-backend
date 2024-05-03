const proshowRouter = require('express').Router();

const { getProshowDetails, registerProshow } = require("../controllers/proshow_controller");

// proshowRouter.post('/registerProshow', registerProshow);

proshowRouter.get('/getProshowDetails/:id', getProshowDetails);

module.exports = proshowRouter;