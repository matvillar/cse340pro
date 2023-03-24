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
  const classificationSelect = await utilities.buildClassDropDown();
  res.render('../views/inventory/management.ejs', {
    title: `Vehicle Management`,
    nav,
    message: null,
    classificationSelect,
  });
};

invCont.addClassView = async function (req, res, next) {
  console.log('addclasVie called');
  let nav = await utilities.getNav();
  res.render('../views/inventory/add-classification.ejs', {
    title: `Add New Classification`,
    nav,
    message: null,
  });
};
invCont.addVehicleView = async function (req, res, next) {
  console.log('add Vehicleview called');
  let nav = await utilities.getNav();
  let classificationSelect = await utilities.buildClassDropDown();
  res.render('../views/inventory/add-vehicle.ejs', {
    title: `Add New Vehicle`,
    nav,
    classificationSelect,
    message: null,
  });
};

/* ****************************************
 *  Process Add New Classification
 **************************************** */
invCont.AddClass = async function (req, res) {
  console.log('Addclass called');
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

  if (addVehicleResult) {
    const classificationSelect = await utilities.buildClassDropDown(
      classification_id
    );
    res.status(201).render('../views/inventory/management.ejs', {
      title: 'Vehicle Management',
      nav,
      message: `The ${inv_make} ${inv_model} classification was successfully added.`,
      errors: null,
      classificationSelect,
    });
  } else {
    const classificationSelect = await utilities.buildClassDropDown(
      classification_id
    );
    const message = 'Sorry, the Addition of New Vehicle failed.';
    res.status(501).render('../views/inventory/add-vehicle.ejs', {
      title: 'Add New Vehicle',
      nav,
      message,
      errors: null,
      classificationSelect,
    });
  }
};

// Create a function to get all vehicles by classification id
invCont.getVehiclesJSON = async function (req, res, next) {
  const classification_id = parseInt(req.params.classification_id);
  const vehicleData = await invModel.getVehiclesByClassificationId(
    classification_id
  );
  if (vehicleData[0].inv_id) {
    return res.json(vehicleData);
  } else {
    next(new Error('No vehicles found'));
  }
};
//Build edit vehicle view
invCont.buildEditVehicleView = async function (req, res, next) {
  const inventoryId = parseInt(req.params.inventoryId);
  let nav = await utilities.getNav();
  let vehicleData = await invModel.getSpecificVehicles(inventoryId);
  const vehicleName = `${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`;
  let classificationSelect = await utilities.buildClassDropDown(
    vehicleData[0].classification_id
  );
  res.render('./inventory/edit-vehicle.ejs', {
    title: 'Edit ' + vehicleName,
    nav,
    classificationSelect: classificationSelect,
    message: null,
    errors: null,
    inv_id: vehicleData[0].inv_id,
    inv_make: vehicleData[0].inv_make,
    inv_model: vehicleData[0].inv_model,
    inv_year: vehicleData[0].inv_year,
    inv_description: vehicleData[0].inv_description,
    inv_image: vehicleData[0].inv_image,
    inv_thumbnail: vehicleData[0].inv_thumbnail,
    inv_price: vehicleData[0].inv_price,
    inv_miles: vehicleData[0].inv_miles,
    inv_color: vehicleData[0].inv_color,
    classification_id: vehicleData[0].classification_id,
  });
};

/* ***************************
 *  Update Vehicle Data
 * ************************** */
invCont.updateVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  console.log(inv_image, inv_thumbnail);

  const updateResult = await invModel.updateVehicle(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    console.log('updateResult', updateResult);
    const vehicleName = updateResult.inv_make + ' ' + updateResult.inv_model;
    const classificationSelect = await utilities.buildClassDropDown(
      classification_id
    );

    res.status(201).render('../views/inventory/management.ejs', {
      title: 'Vehicle Management',
      nav,
      classificationSelect: classificationSelect,
      message: `The ${vehicleName} was successfully updated.`,
      errors: null,
    });
  } else {
    console.log('updateResult', updateResult);
    const inv_id = updateResult.inv_id;
    const classificationSelect = await utilities.buildClassDropDown(
      classification_id
    );
    const vehicleName = `${inv_make} ${inv_model}`;
    res.status(501).render('../views/inventory/edit-vehicle.ejs', {
      title: 'Edit ' + vehicleName,
      nav,
      classificationSelect: classificationSelect,
      message: 'Sorry, the insert failed.',
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};
/* ***************************
 * build delete Vehicle confirmation view
 * ************************** */
invCont.buildDeleteVehicleView = async function (req, res, next) {
  const inventoryId = parseInt(req.params.inventoryId);
  let nav = await utilities.getNav();
  let vehicleData = await invModel.getSpecificVehicles(inventoryId);
  const vehicleName = `${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`;
  res.render('./inventory/delete-confirm.ejs', {
    title: 'Delete ' + vehicleName,
    nav,
    message: null,
    errors: null,
    inv_id: vehicleData[0].inv_id,
    inv_make: vehicleData[0].inv_make,
    inv_model: vehicleData[0].inv_model,
    inv_year: vehicleData[0].inv_year,
    inv_price: vehicleData[0].inv_price,
  });
};

/* ***************************
 *  Deliver delete Vehicle Data
 * ************************** */
invCont.deleteVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const parsedInvId = parseInt(inv_id);

  const updateResult = await invModel.deleteVehicleData(parsedInvId);

  if (updateResult) {
    console.log('updateResult', updateResult);
    const vehicleName = inv_make + ' ' + inv_model;
    const classificationSelect = await utilities.buildClassDropDown(
      classification_id
    );

    res.status(201).render('../views/inventory/management.ejs', {
      title: 'Vehicle Management',
      nav,
      classificationSelect: classificationSelect,
      message: `The ${vehicleName} was successfully deleted.`,
      errors: null,
    });
  } else {
    const inv_id = updateResult.inv_id;
    const classificationSelect = await utilities.buildClassDropDown(
      classification_id
    );
    const vehicleName = `${inv_make} ${inv_model}`;
    res.status(501).render('../views/inventory/edit-vehicle.ejs', {
      title: 'Edit ' + vehicleName,
      nav,
      classificationSelect: classificationSelect,
      message: 'Sorry, the deletion failed.',
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};
module.exports = invCont;
