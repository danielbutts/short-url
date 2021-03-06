const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getUrlsLikeHash = async ({ hash }) => {
  try {
    // TODO - sanitize hash to prevent SQL injection
    const result = await pool.query('SELECT * FROM urls WHERE hash like $1', [`${hash}%`]);
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('getUrlsLikeHash', err.message);
    throw err;
  }
};

const getUrlByHash = async ({ shortHash }) => {
  try {
    // TODO - sanitize hash to prevent SQL injection
    const result = await pool.query('SELECT * FROM urls WHERE shorthash = $1', [shortHash]);
    const { rows: [row] } = result;
    return row;
  } catch (err) {
    console.error('getUrlByHash', err.message);
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
    const result = await pool.query('UPDATE urls set updatedttm = now() WHERE shorthash = $1', [shortHash]);
    return result;
  } catch (err) {
    console.error('resetHashedUrl', err.message);
    throw err;
  }
};

const getUrls = async () => {
  try {
    // TODO - sanitize hash to prevent SQL injection
    const result = await pool.query('SELECT * FROM urls');
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('getUrls', err.message);
    throw err;
  }
};

module.exports = {
  getUrlsLikeHash,
  getUrlByHash,
  getUrls,
  insertHashedUrl,
  resetHashedUrl,
};
