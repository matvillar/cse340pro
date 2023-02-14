const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/index');
const buildLogin = require('../controllers/accController');

router.get('/login', buildLogin);

module.exports = router;
