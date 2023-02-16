const express = require('express');
const router = new express.Router();
const manageController = require('../controllers/manageController');

router.get('/add-classification', manageController.addClass);
router.get('/add-vehicle', manageController.addVehicle);
router.get('/admin', manageController.managerView);

module.exports = router;
