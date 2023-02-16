const utilities = require('../utilities/index.js');
const manageModel = require('../models/manager-model');

const manageController = {};

manageController.managerView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('../views/inventory/management.ejs', {
    title: `Vehicle Management`,
    nav,
    message: null,
  });
};

manageController.addClassView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('../views/inventory/add-classification.ejs', {
    title: `Add New Classification`,
    nav,
    message: null,
  });
};
manageController.addVehicleView = async function (req, res, next) {
  let nav = await utilities.getNav();
  let selectOption = await utilities.getClassDropDown();
  res.render('../views/inventory/add-vehicle.ejs', {
    title: `Add New Vehicle`,
    nav,
    selectOption,
    message: null,
  });
};

/* ****************************************
 *  Process Add New Classification
 **************************************** */
manageController.AddClass = async function (req, res) {
  let nav = await utilities.getNav();

  const { classification_name } = req.body;

  const addClassResult = await manageModel.addClassCar(classification_name);
  console.log(addClassResult);
  if (addClassResult) {
    res.status(201).render('../views/inventory/management.ejs', {
      title: 'Vehicle Management',
      nav,
      message: `The ${classification_name} classification was successfully added.`,
      errors: null,
    });
  } else {
    const message = 'Sorry, the Addition of New Classification failed.';
    res.status(501).render('../views/inventory/add-classification.ejs', {
      title: 'Add New Classification',
      nav,
      message,
      errors: null,
    });
  }
};
/* ****************************************
 *  Process Add New Vehicle
 **************************************** */
manageController.AddVehicle = async function (req, res) {
  let nav = await utilities.getNav();

  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  console.log(classification_id);
  const addVehicleResult = await manageModel.addVehicleToData(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );
  console.log(addVehicleResult);
  if (addVehicleResult) {
    res.status(201).render('../views/inventory/management.ejs', {
      title: 'Vehicle Management',
      nav,
      message: `The ${inv_make} ${inv_model} classification was successfully added.`,
      errors: null,
    });
  } else {
    const message = 'Sorry, the Addition of New Vehicle failed.';
    res.status(501).render('../views/inventory/add-classification.ejs', {
      title: 'Add New Classification',
      nav,
      message,
      errors: null,
    });
  }
};
module.exports = manageController;
