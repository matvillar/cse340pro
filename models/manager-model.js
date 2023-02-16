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
async function addVehicleToData(
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color
) {
  console.log(classification_id);
  try {
    const sql =
      'INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';

    return await pool.query(sql, [
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
    ]);
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
module.exports = { addClassCar, getClassList, addVehicleToData };
