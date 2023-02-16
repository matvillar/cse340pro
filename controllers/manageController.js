const utilities = require('../utilities/index.js');

const manageController = {};

manageController.managerView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('../views/inventory/management.ejs', {
    title: `Vehicle Management`,
    nav,
    message: null,
  });
};

manageController.addClass = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('../views/inventory/add-classification.ejs', {
    title: `Add New Classification`,
    nav,
    message: null,
  });
};
manageController.addVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('../views/inventory/add-vehicle.ejs', {
    title: `Add New Vehicle`,
    nav,
    message: null,
  });
};

module.exports = manageController;
