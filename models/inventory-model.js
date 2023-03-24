const pool = require('../database/');

async function getClassifications() {
  return await pool.query(
    'SELECT * FROM public.classification ORDER BY classification_name'
  );
}

async function getVehiclesByClassificationId(classificationId) {
  try {
    const data = await pool.query(
      'SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1',
      [classificationId]
    );

    return data.rows;
  } catch (error) {
    console.log(`getclassificationsbyid error ${error}`);
  }
}
async function getSpecificVehicles(inventoryId) {
  try {
    const data = await pool.query(
      'SELECT * FROM public.inventory WHERE inventory.inv_id = $1',
      [inventoryId]
    );
    return data.rows;
  } catch (error) {
    console.log(`getspecificvehicle error ${error}`);
  }
}

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
    return data.rows;
  } catch (error) {
    console.log(`getspecificvehicle error ${error}`);
  }
}

async function checkClassNameExists(classification_name) {
  try {
    const sql =
      'SELECT * FROM public.classification WHERE classification_name = $1';
    const className = await pool.query(sql, [classification_name]);

    return className.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Update Vehicle Data
 * ************************** */
async function updateVehicle(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      'UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *';
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    console.log(data.rows[0]);
    return data.rows[0];
  } catch (error) {
    console.error('model error: ' + error);
  }
}

/* ***************************
 *  Update Vehicle Data
 * ************************** */
async function deleteVehicleData(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.error('model error: ' + error);
  }
}

module.exports = {
  getClassifications,
  getVehiclesByClassificationId,
  getSpecificVehicles,
  addClassCar,
  getClassList,
  addVehicleToData,
  checkClassNameExists,
  updateVehicle,
  deleteVehicleData,
};
