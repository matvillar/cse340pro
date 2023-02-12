const invModel = require('../models/inventory-model');
const utilities = require('../utilities');

const invCont = {};
// const vehicleCont = {};

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
  // const vehicleName = `   ${data[0].inv_description}`;
  // console.log(data[0]);
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  res.render('./inventory/vehicle-detail', {
    title: `${vehicleName}`,
    vehicleName,
    nav,
    message: null,
    data,
  });
};

module.exports = invCont;
