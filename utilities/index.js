const invModel = require('../models/inventory-model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

Util.buildClassDropDown = async function (classification_id = null) {
  let data = await invModel.getClassList();
  let select = '<label>Classification </label>';
  select += '<select name="classification_id" id="className"> ';
  select += '<option disabled selected>Choose a Class</option>  ';

  data.forEach((row) => {
    select += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      select += ' selected';
    }
    select += '>' + row.classification_name + '</option>';
  });
  select += '</select>';
  return select;
};
Util.checkJWTToken = (req, res, next) => {
  jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function (err) {
    if (err) {
      return res.status(403).redirect('/client/login');
    } else {
      return next();
    }
  });
};

// ********************************************
// Authorize JWT Token
// ********************************************
Util.jwtAuthorize = (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    const clientData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.clientData = clientData;
    next();
  } catch (err) {
    // Redirect to login page if token is invalid
    res.clearCookie('jwt', { httpOnly: true });
    return res.status(403).redirect('/client/login');
  }
};

Util.checkClientLogin = (req, res, next) => {
  if (req.cookies.jwt) {
    res.locals.loggedin = 1;
    next();
  } else {
    next();
  }
};
Util.clearCookie = (req, res, next) => {
  res.clearCookie('jwt', { httpOnly: true });
  next();
};

Util.checkAdmin = (req, res, next) => {
  if (
    req.clientData.client_type != 'Employee' &&
    req.clientData.client_type != 'Admin'
  ) {
    return res.status(403).redirect('/client/login');
  }
  next();
};

Util.checkAdmin = (req, res, next) => {
  if (
    req.clientData.client_type != 'Employee' &&
    req.clientData.client_type != 'Admin'
  ) {
    return res.status(403).redirect('/client/login');
  }
  next();
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
