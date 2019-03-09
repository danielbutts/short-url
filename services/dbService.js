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
    console.error('getUrlsByHash', err.message);
    throw err;
  }
};

const insertHashedUrl = async ({ hash, shortHash, url }) => {
  try {
    // TODO - sanitize hash to prevent SQL injection
    const result = await pool.query('INSERT INTO urls (url, hash, shorthash) VALUES ($1, $2, $3)', [url, hash, shortHash]);
    return result;
  } catch (err) {
    console.error('insertHashedUrl', err.message);
    throw err;
  }
};

const resetHashedUrl = async ({ shortHash }) => {
  try {
    // TODO - sanitize hash to prevent SQL injection
    const result = await pool.query('UPDATE urls set updatedttm = now(), active = true WHERE shorthash = $1', [shortHash]);
    return result;
  } catch (err) {
    console.error('resetHashedUrl', err.message);
    throw err;
  }
};


const getUrls = async () => {
  try {
    const result = await pool.query('SELECT * FROM urls');
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('getUrls', err.message);
    throw err;
  }
};

module.exports = {
  getUrlsByHash,
  getUrls,
  insertHashedUrl,
  resetHashedUrl,
};
