const utilities = require('../utilities/index.js');
const accModel = require('../models/account-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/* ****************************************
 *  Deliver login view
 **************************************** */

const accController = {};

accController.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('clients/login', {
    title: 'Login',
    nav,
    message: null,
  });
};
accController.buildLogOut = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.clearCookie('jwt');
  res.locals.loggedin = 0;
  res.render('../views/index.ejs', {
    title: 'Login',
    nav,
    message: null,
  });
};
accController.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('clients/register', {
    title: 'Register',
    nav,
    errors: null,
    message: null,
  });
};

/* ****************************************
 *  Process registration request
 **************************************** */
accController.registerClient = async function (req, res) {
  let nav = await utilities.getNav();

  const { client_firstname, client_lastname, client_email, client_password } =
    req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // pass regular password and cost(salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(client_password, 10);
  } catch (error) {
    res.status(500).render('../views/clients/register.ejs', {
      title: 'Registration',
      nav,
      message: 'Sorry. there was an error processing the registration.',
      errors: null,
    });
  }

  const regResult = await accModel.registerClient(
    client_firstname,
    client_lastname,
    client_email,
    hashedPassword
  );
  console.log(regResult);
  if (regResult) {
    res.status(201).render('clients/login.ejs', {
      title: 'Login',
      nav,
      message: `Congratulations, you\'re registered ${client_firstname}. Please log in.`,
      errors: null,
    });
  } else {
    const message = 'Sorry, the registration failed.';
    res.status(501).render('clients/register', {
      title: 'Registration',
      nav,
      message,
      errors: null,
    });
  }
};

// /* **************************************** Process login request **************************************** */
accController.loginClient = async function loginClient(req, res) {
  let nav = await utilities.getNav();
  const { client_email, client_password } = req.body;
  const clientData = await accModel.getClientByEmail(client_email);
  if (!clientData) {
    const message = 'Please check your credentials and try again.';
    res.status(400).render('clients/login', {
      title: 'Login',
      nav,
      message,
      errors: null,
      client_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(client_password, clientData.client_password)) {
      delete clientData.client_password;
      const accessToken = jwt.sign(
        clientData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      res.cookie('jwt', accessToken, { httpOnly: true });
      return res.redirect('/client/');
    }
  } catch (error) {
    return res.status(403).send('Access Forbidden');
  }
};

// Logged in user
accController.buildLoggedView = async function (req, res, next) {
  const nav = await utilities.getNav();
  // Retrieve the client type from the client data
  res.render('clients/logged-view', {
    title: "You're logged in",
    nav,
    message: null,
    errors: null,
    clientData: req.clientData,
  });
};
module.exports = accController;
