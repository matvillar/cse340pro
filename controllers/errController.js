const utilities = require('../utilities');

/* ***********************
Error link route
*************************/

async function buildError(req, res, next) {
  let nav = await utilities.getNav();
  res.render('/views/errors/error.ejs', {
    title: 'Error',
    nav,
    message: null,
    errors: null,
  });
}

module.exports = { buildError };
