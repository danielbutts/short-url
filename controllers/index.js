const Url = require('url-parse');
const validator = require('validator');
const crypto = require('crypto');

// const db = require('../services/dbService');

// esure that provided string is a valid URL
const validateUrl = ({ url }) => {
  try {
    const valid = validator.isURL(url);
    return valid;
  } catch (error) {
    throw error;
  }
};

// split, order, and join query parameters prior to uniqueness check
const sortQuerystring = ({ query }) => {
  try {
    let sortedQuery = query;

    // removes '?' from querystring if it exists
    if (sortedQuery.substring(0, 1) === '?') {
      sortedQuery = sortedQuery.substring(1);
    }

    // sort query parameters alphabetically
    let params = sortedQuery.split('&');
    params = params.sort();

    // reassemble sorted querystring
    sortedQuery = `?${params.join('&')}`;
    return sortedQuery;
  } catch (error) {
    throw error;
  }
};

// MD5 Hash the URL to generate a unique hash representation of consistent length
const hashUrl = ({ url }) => {
  try {
    const hash = crypto.createHash('md5');

    // TODO - consider removing '/' and '+' characters from hashed URL to improve reability
    let hashedUrl = hash.update(url).digest('base64');

    // remove trailing padding from hashed string
    if (hashedUrl.indexOf('=') !== -1) {
      hashedUrl = hashedUrl.substring(0, hashedUrl.indexOf('='));
    }

    return hashedUrl;
  } catch (error) {
    throw error;
  }
};

// controller functions for creating an retreiving shortened urls
const generateHash = ({ url }) => {
  try {
    if (!validateUrl({ url })) throw new Error('Url is invalid');
    const parsedUrl = new Url(url);
    const { origin, pathname, query } = parsedUrl;

    // console.log('url', origin, pathname, query);
    const sortedQuery = sortQuerystring({ query });
    const hash = hashUrl({ url: `${origin}${pathname}${sortedQuery}` });

    return hash;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  generateHash,
};
