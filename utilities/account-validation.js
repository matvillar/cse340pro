const accountModel = require('../models/account-model');
const utilities = require('./');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const validate = {};

validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body('client_firstname')
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage('Please provide a first name'), // on error this m,essage will be sent

    // Lastname is required and must be string

    body('client_lastname')
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage('Please provide a last name'), // on error this m,essage will be sent

    // Valid email is required and cannot already exist in the database

    body('client_email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('a valid email is required.')
      .custom(async (client_email) => {
        const emailExists = await accountModel.checkExistingEmail(client_email); // is it checkEmail or checkExistingEmail?? *******
        if (emailExists) {
          throw new Error('Email exists. Please login or use different email');
        }
      }),

    // password is required and must be strong password
    body('client_password')
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements.'),
  ];
};

//  Check data and return errors or continue to registration

validate.checkRegData = async (req, res, next) => {
  const { client_firstname, client_lastname, client_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('../views/clients/register.ejs', {
      errors,
      message: null,
      title: 'Registration',
      nav,
      client_firstname,
      client_lastname,
      client_email,
    });
    return;
  }
  next();
};

validate.loginRules = () => {
  return [
    body('client_email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.'),

    body('client_password')
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements.'),
  ];
};

validate.checkLogData = async function (req, res, next) {
  const { client_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('../views/clients/login.ejs', {
      errors,
      message: null,
      title: 'Login',
      nav,
      client_email,
    });
    return;
  }
  next();
};

// Validate the updated profile and password
validate.updateProfileRules = () => {
  return [
    // firstname is required and must be string
    body('client_firstname')
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage('Please provide a first name'), // on error this m,essage will be sent

    // Lastname is required and must be string

    body('client_lastname')
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage('Please provide a last name'), // on error this m,essage will be sent

    // Valid email is required and cannot already exist in the database

    body('client_email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('a valid email is required.'),
  ];
};
validate.checkUpdateProfileData = async (req, res, next) => {
  console.log('checkUpdateProfileData');
  const { client_firstname, client_lastname, client_email, client_id } =
    req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    let nav = await utilities.getNav();
    res.render('../views/clients/edit-account.ejs', {
      errors,
      message: null,
      title: 'Edit Profile',
      nav,
      client_firstname,
      client_lastname,
      client_email,
      client_id,
    });
    return;
  }
  next();
};
//  Validate the updated password

// Validate the updated profile and password
validate.updatePasswordRules = () => {
  return [
    // password is required and must be strong password
    body('client_password')
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage('Password does not meet requirements.'),
  ];
};

// Check data and return errors for update password
validate.checkUpdatePasswordData = async (req, res, next) => {
  console.log('checkUpdatePasswordData');
  const { client_id } = req.body;

  const clientData = await accountModel.getClientById(client_id);
  console.log(clientData.client_firstname);
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('../views/clients/edit-account.ejs', {
      errors,
      message: null,
      title: 'Edit Profile',
      nav,
      client_firstname: clientData.client_firstname,
      client_lastname: clientData.client_lastname,
      client_email: clientData.client_email,
      client_id,
    });
    return;
  }
  next();
};

module.exports = validate;
