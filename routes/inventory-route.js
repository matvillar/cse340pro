// Needed Resources
const invValidate = require('../utilities/inventory-validation');
const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/index.js');
const invController = require('../controllers/invController');

// Route to build inventory by classification view

router.get('/type/:classificationId', invController.buildByClassification);
router.get('/detail/:inventoryId', invController.buildByVehicle);
router.get('/getVehicles/:classification_id', invController.getVehiclesJSON);

// Route to build build edit vehicle view
router.get('/edit/:inventoryId', invController.buildEditVehicleView);
router.post(
  '/update/',
  invValidate.addVehicleRules(),
  invValidate.checkUpdateData,
  invController.updateVehicle
);
// Route to delete vehicle
router.get('/delete/:inventoryId', invController.buildDeleteVehicleView);
router.post('/delete/', invController.deleteVehicle);
// Manager Route
router.get('/add-classification', invController.addClassView);
router.get('/add-vehicle', invController.addVehicleView);
router.get(
  '/',
  utilities.jwtAuthorize,
  utilities.checkAdmin,
  invController.managerView
);

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
