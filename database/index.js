const { Pool } = require('pg');
require('dotenv').config();

// ************************
// Connection Pool
// SSL object needed for local testing of app
// when using remote DB Connection(lines 11 -13)
// comment out for deployment
// ***********************

let pool;

if (process.env.NODE_ENV == 'development') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

module.exports = pool;
