// Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');

// Route to build inventory by classification view

router.get('/type/:classificationId', invController.buildByClassification);
router.get('/detail/:inventoryId', invController.buildByVehicle);

// Manager Route
router.get('/add-classification', invController.addClassView);
router.get('/add-vehicle', invController.addVehicleView);
router.get('/admin-inv', invController.managerView);

router.post('/admin-inv', invController.AddClass);
router.post('/add-vehicle', invController.AddVehicle);
module.exports = router;
