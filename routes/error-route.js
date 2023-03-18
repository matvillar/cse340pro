const express = require('express');
const router = new express.Router();
const utilities = require('../utilities');
const errController = require('../controllers/errController');

// Error link route

router.get('/', utilities.handleErrors(errController.buildError));

module.exports = router;
