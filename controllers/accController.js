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
  console.log(`buildLoggedView:`);
  const nav = await utilities.getNav();
  res.render('clients/logged-view', {
    title: 'Account Management',
    nav,
    otherMessage: "You're logged in.",
    message: null,
    errors: null,
    clientData: req.clientData,
  });
};

// build Edit profile view
accController.buildEditAccView = async function (req, res, next) {
  const clientId = req.params.client_id;
  const clientData = await accModel.getClientById(clientId);
  const nav = await utilities.getNav();
  // Retrieve the client type from the client data
  res.render('../views/clients/edit-account.ejs', {
    title: 'Edit Account',
    nav,
    message: null,
    errors: null,
    client_firstname: clientData.client_firstname,
    client_lastname: clientData.client_lastname,
    client_email: clientData.client_email,
    client_id: clientData.client_id,
  });
};
// Edit profile
accController.editAccount = async function (req, res, next) {
  const nav = await utilities.getNav();
  const { client_firstname, client_lastname, client_email, client_id } =
    req.body;

  const profileBeforeUpdate = await accModel.getClientById(client_id);
  if (
    profileBeforeUpdate.client_email === client_email &&
    profileBeforeUpdate.client_firstname === client_firstname &&
    profileBeforeUpdate.client_lastname === client_lastname
  ) {
    const message = 'No Changes Made.';
    res.render('../views/clients/edit-account.ejs', {
      title: 'Edit Account',
      nav,
      message,
      errors: null,
      client_email: profileBeforeUpdate.client_email,
      client_firstname: profileBeforeUpdate.client_firstname,
      client_lastname: profileBeforeUpdate.client_lastname,
      client_id,
    });
  } else {
    const updateResult = await accModel.updateProfile(
      client_firstname,
      client_lastname,
      client_email,
      client_id
    );
    const clientData = await accModel.getClientById(client_id);

    if (updateResult) {
      res.render('../views/clients/logged-view.ejs', {
        title: 'Account Management',
        nav,
        message: 'Your profile has been updated.',
        errors: null,
        clientData,
        otherMessage: null,
      });
    } else {
      const message = 'Sorry, the update failed.';
      res.status(501).render('../views/clients/edit-account.ejs', {
        title: 'Edit Account',
        nav,
        message,
        errors: null,
        client_email,
        client_firstname,
        client_lastname,
      });
    }
  }
  if (profileBeforeUpdate.client_email !== client_email) {
    const emailExists = await accModel.checkExistingEmail(client_email);
    if (emailExists) {
      const message = 'Sorry, the email already exists.';
      res.status(503).render('../views/clients/edit-account.ejs', {
        title: 'Edit Account',
        nav,
        message,
        errors: null,
        client_email: profileBeforeUpdate.client_email,
        client_firstname: profileBeforeUpdate.client_firstname,
        client_lastname: profileBeforeUpdate.client_lastname,
      });
    } else {
      const updateResult = await accModel.updateProfile(
        client_firstname,
        client_lastname,
        client_email,
        client_id
      );
      const clientData = await accModel.getClientById(client_id);

      if (updateResult) {
        res.render('../views/clients/logged-view.ejs', {
          title: 'Account Management',
          nav,
          message: 'Your profile has been updated.',
          errors: null,
          clientData,
          otherMessage: null,
        });
      } else {
        const message = 'Sorry, the update failed.';
        res.status(501).render('../views/clients/edit-account.ejs', {
          title: 'Edit Account',
          nav,
          message,
          errors: null,
          client_email,
          client_firstname,
          client_lastname,
        });
      }
    }
  }
};

// Update Password
accController.updatePassword = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { client_password, client_id } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // pass regular password and cost(salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(client_password, 10);
  } catch (error) {
    res.status(500).render('../views/clients/edit-account.ejs', {
      title: 'Edit Account',
      nav,
      message: 'Sorry. there was an error updating the new password.',
      errors: null,
    });
  }

  const changePassword = await accModel.changePassword(
    hashedPassword,
    client_id
  );

  const clientData = await accModel.getClientById(client_id);

  if (changePassword) {
    res.render('clients/logged-view', {
      title: 'Login',
      nav,
      otherMessage: `Password has been changed.`,
      message: null,
      errors: null,
      client_password,
      client_firstname: clientData.client_firstname,
      clientData,
    });
  } else {
    const message = 'Sorry, the update failed.';
    res.status(501).render('clients/edit-account', {
      title: 'Registration',
      nav,
      clientData,
      message,
      errors: null,
    });
  }
};
module.exports = accController;
