const regValidate = require('../utilities/account-validation');
const express = require('express');
const router = new express.Router();
const accController = require('../controllers/accController');

router.get('/login', accController.buildLogin);
router.get('/register', accController.buildRegister);
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  accController.registerClient
);

router.post('/login', (req, res) => {
  res.status(200).send('login process');
});
module.exports = router;
