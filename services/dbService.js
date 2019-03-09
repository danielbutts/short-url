const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getUrlsByHash = async ({ hash }) => {
  try {
    // TODO - sanitize hash to prevent SQL injection
    const result = await pool.query('SELECT * FROM urls WHERE hash like $1', [`${hash}%`]);
    const { rows } = result;
    return rows;
  } catch (err) {
    throw err;
  }
};

const getUrls = async () => {
  try {
    const result = await pool.query('SELECT * FROM urls');
    const { rows } = result;
    return rows;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getUrlsByHash,
  getUrls,
};
