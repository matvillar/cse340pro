const pool = require('../database/');

// register new client

async function addClassCar(classification_name) {
  try {
    const sql =
      'INSERT INTO classification (classification_name) VALUES ($1) RETURNING *';

    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

module.exports = { addClassCar };
