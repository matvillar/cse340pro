/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const env = require('dotenv').config();
const app = express();
const baseController = require('./controllers/baseController');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

/* ***********************
 * Middleware
 *************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //for parsing

/* ***********************
 * Routes
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout'); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(require('./routes/static'));

// Inventory routes
app.use('/inv', require('./routes/inventory-route'));

//Account Routes
app.use('/client', require('./routes/account-route'));
// Cooklie Parser
app.use(cookieParser());
// Index Route
app.get('/', baseController.buildHome);

// app.get('/', (req, res) => {
//   res.send('hello');
// });

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
