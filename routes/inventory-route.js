// Needed Resources
const invValidate = require('../utilities/inventory-validation');
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');

// Route to build inventory by classification view

router.get('/type/:classificationId', invController.buildByClassification);
router.get('/detail/:inventoryId', invController.buildByVehicle);

// Manager Route
router.get('/add-classification', invController.addClassView);
router.get('/add-vehicle', invController.addVehicleView);
router.get('/', invController.managerView);

router.post(
  '/add-classification',
  invValidate.addClassRules(),
  invValidate.checkClassNameData,
  invController.AddClass
);
router.post(
  '/add-vehicle',
  invValidate.addVehicleRules(),
  invValidate.checkAddVehicleData,
  invController.AddVehicle
);
module.exports = router;
