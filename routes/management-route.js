const express = require('express');
const router = new express.Router();
const manageController = require('../controllers/manageController');

router.get('/add-classification', manageController.addClassView);
router.get('/add-vehicle', manageController.addVehicleView);
router.get('/admin-inv', manageController.managerView);

router.post('/admin-inv', manageController.AddClass);
router.post('/admin-inv', manageController.AddVehicle);

module.exports = router;
