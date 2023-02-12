const invModel = require('../models/inventory-model');
const Util = {};

// ********************************************
// Constructs the nav HTML ul
// ********************************************

Util.buildNav = function (data) {
  let list = '<ul>';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li>';
    list += `<a href="/inv/type/${row.classification_id}" title="See our Inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`;
    list += '</li>';
  });
  list += '</ul>';
  return list;
};
// Car View

// Util.builCarView = function (data) {
//   data.rows.forEach((row) => {
//     `<h2>${row.inv_year} ${row.inv_make} </h2>`;
//   });
// };

// ********************************************
// Builds the navigation bar
// ********************************************
//  This builds the site nav

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();

  let nav = Util.buildNav(data);

  // let view = Util.builCarView(data);
  return nav;
};

// builds car view
// Util.getCar = async function (req, res, next) {
//   let data = await invModel.getSpecificVehicles();

//   // return [];

//   return view;
// };

module.exports = Util;
