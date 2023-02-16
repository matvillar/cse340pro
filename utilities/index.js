const invModel = require('../models/inventory-model');
const managerModel = require('../models/manager-model');
const Util = {};

// ********************************************
// Constructs the nav HTML ul
// ********************************************

Util.buildNav = function (data) {
  let list = '<ul class="navbar">';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li>';
    list += `<a href="/inv/type/${row.classification_id}" title="See our Inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`;
    list += '</li>';
  });
  list += '</ul>';
  return list;
};

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();

  let nav = Util.buildNav(data);

  // let view = Util.builCarView(data);
  return nav;
};
// Car selection/option (drop down)
Util.getClassDropDown = async function (req, res, next) {
  try {
    let data = await managerModel.getClassList();
    // console.log('Data:', data);
    let selectOption = Util.buildClassDropDown(data);

    return selectOption;
  } catch (error) {
    console.log(`getClassDropDown error: ${error}`);
    return error;
  }
};
// build Dorp down select option
Util.buildClassDropDown = function (data) {
  let select = `<label for="classificationName">Classification</label>`;
  select += `<select name="classification_id" id="className"> `;

  data.forEach((row) => {
    select += `<option value="${row.classification_id}">${row.classification_name}</option>`;
  });
  select += '</select>';
  return select;
};

module.exports = Util;
