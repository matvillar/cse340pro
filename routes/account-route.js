const regValidate = require('../utilities/account-validation');
const express = require('express');
const router = new express.Router();
const accController = require('../controllers/accController');
const utilities = require('../utilities/index.js');

router.get('/login', accController.buildLogin);
router.get('/logout', accController.buildLogOut);
router.get('/register', accController.buildRegister);

// Admnistration routes
router.get(
  '/',
  utilities.checkJWTToken,
  utilities.jwtAuthorize,
  accController.buildLoggedView
);
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  accController.registerClient
);

router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLogData,
  accController.loginClient
);

module.exports = router;
