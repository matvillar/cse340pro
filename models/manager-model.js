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

async function getClassList() {
  try {
    const data = await pool.query('SELECT * FROM public.classification');
    // console.log(data);
    // console.log(data.rows);
    return data.rows;
  } catch (error) {
    console.log(`getspecificvehicle error ${error}`);
  }
}
module.exports = { addClassCar, getClassList };
