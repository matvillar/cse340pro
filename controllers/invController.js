const invModel = require('../models/inventory-model');
const utilities = require('../utilities');

const invCont = {};

invCont.buildByClassification = async function (req, res, next) {
  const classificationId = req.params.classificationId;
  let data = await invModel.getVehiclesByClassificationId(classificationId);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render('./inventory/classification-view', {
    title: `${className} vehicles`,
    nav,
    message: null,
    data,
  });
};

invCont.buildByVehicle = async function (req, res, next) {
  const inventoryId = req.params.inventoryId;
  let data = await invModel.getSpecificVehicles(inventoryId);
  let nav = await utilities.getNav();
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  res.render('./inventory/vehicle-detail', {
    title: `${vehicleName}`,
    vehicleName,
    nav,
    message: null,
    data,
  });
};

//Manager Functions

invCont.managerView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('../views/inventory/management.ejs', {
    title: `Vehicle Management`,
    nav,
    message: null,
  });
};

invCont.addClassView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('../views/inventory/add-classification.ejs', {
    title: `Add New Classification`,
    nav,
    message: null,
  });
};
invCont.addVehicleView = async function (req, res, next) {
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
invCont.AddClass = async function (req, res) {
  let nav = await utilities.getNav();

  const { classification_name } = req.body;

  const addClassResult = await invModel.addClassCar(classification_name);
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
invCont.AddVehicle = async function (req, res) {
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
  const addVehicleResult = await invModel.addVehicleToData(
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

module.exports = invCont;
