const invModel = require('../models/inventory-model');
const utilities = require('./');
const { body, validationResult } = require('express-validator');

const invValidate = {};

invValidate.addClassRules = () => {
  console.log('Add Class Rules');
  return [
    body('classification_name')
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage('Please provide a Classification Name')
      .custom(async (classification_name) => {
        console.log('inside custom function');
        const classNameExists = await invModel.checkClassNameExists(
          classification_name
        );
        console.log(classNameExists);
        if (classNameExists) {
          console.log('ERROR THROWN');
          throw new Error(
            'Classification name already exists. Please use different name'
          );
        }
      }),
  ];
};

invValidate.addVehicleRules = () => {
  return [
    body('inv_make')
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage('Please provide the car Make'),

    body('inv_model')
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage('Please provide the car Model'),

    body('inv_description')
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage('Please provide the car Description'),

    body('inv_image')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please provide the car Path'),

    body('inv_thumbnail')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Please provide the car Thumbnail'),

    body('inv_price')
      .trim()
      .notEmpty()
      .withMessage('Input must not be empty')
      .isNumeric()
      .withMessage('Input must be a number')
      .custom((value) => {
        if (Number(value) <= 0) {
          throw new Error('Input must be greater than 0');
        }
        return true;
      }),

    body('inv_year')
      .trim()
      .notEmpty()
      .withMessage('Input must not be empty')
      .isNumeric()
      .withMessage('Input must be a number')
      .isLength({ min: 4, max: 4 })
      .withMessage('Input must have exactly four digits'),

    body('inv_miles')
      .trim()
      .notEmpty()
      .withMessage('Input must not be empty')
      .isNumeric()
      .withMessage('Input must be a number')
      .custom((value) => {
        if (Number(value) <= 0) {
          throw new Error('Input must be greater than 0');
        }
        return true;
      }),

    body('inv_color')
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage('Please provide the car Color'),
  ];
};

invValidate.checkClassNameData = async (req, res, next) => {
  console.log('CheckClassNameData aqui');
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('../views/inventory/add-classification.ejs', {
      title: 'Add New Classification',
      message: null,
      nav,
      errors,
      classification_name,
    });
    return;
  }
  next();
};

invValidate.checkAddVehicleData = async (req, res, next) => {
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
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const classificationSelect = await utilities.buildClassDropDown(
      classification_id
    );
    let nav = await utilities.getNav();
    res.render('../views/inventory/add-vehicle.ejs', {
      classificationSelect,
      errors,
      title: 'Add New Vehicle',
      nav,
      message: null,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

invValidate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
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
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const classificationSelect = await utilities.buildClassDropDown(
      classification_id
    );
    let nav = await utilities.getNav();
    res.render('./inventory/edit-vehicle.ejs', {
      classificationSelect,
      errors,
      title: 'Add New Vehicle',
      nav,
      message: null,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id,
    });
    return;
  }
  next();
};

module.exports = invValidate;
