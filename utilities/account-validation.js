const utilities = require('./');
const { body, validationResult } = require('express-validator');

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

    body('client_password')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('a valid email is required.'),

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

module.exports = validate;
