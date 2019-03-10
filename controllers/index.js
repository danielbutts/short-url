const Url = require('url-parse');
const validator = require('validator');
const crypto = require('crypto');
const db = require('../services/dbService');

const IDEAL_HASH_LENGTH = 8;

// controller functions for creating an retreiving shortened urls

// esure that provided string is a valid URL
const validateUrl = ({ url }) => {
  try {
    const valid = validator.isURL(url);
    return valid;
  } catch (error) {
    console.error('validateUrl', error.message);
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
    console.error('sortQuerystring', error.message);
    throw error;
  }
};

// Replace slashes in the base64 encoded hash to avoid url matching issues in express
const replaceSlashes = ({ str }) => {
  const regex = new RegExp(/\//g);
  const replaced = str.replace(regex, '.');
  return replaced;
};

// MD5 Hash the URL to generate a unique hash representation of consistent length
const hashUrl = ({ url }) => {
  try {
    const hash = crypto.createHash('md5');

    // TODO - consider removing '/' and '+' characters from hashed URL to improve reability
    let hashedUrl = hash.update(url).digest('base64');
    hashedUrl = replaceSlashes({ str: hashedUrl });
    // remove trailing padding from hashed string
    if (hashedUrl.indexOf('=') !== -1) {
      hashedUrl = hashedUrl.substring(0, hashedUrl.indexOf('='));
    }

    return hashedUrl;
  } catch (error) {
    console.error('hashUrl', error.message);
    throw error;
  }
};

// get all urls
const getUrls = async () => {
  try {
    return urls = await db.getUrls();
  } catch (error) {
    console.error('getUrls', error.message);
    throw error;
  }
};

// get urls matching short hash
const getUrlsByHashPrefix = async ({ hash }) => {
  try {
    const shortHash = hash.substring(0, IDEAL_HASH_LENGTH);
    const urls = await db.getUrlsLikeHash({ hash: shortHash });
    return urls;
  } catch (error) {
    console.error('getUrlsByHashPrefix', error.message);
    throw error;
  }
};

// get url exactly matching a hash
const getUrlByHash = async ({ shortHash }) => {
  try {
    const url = await db.getUrlByHash({ shortHash });
    return url;
  } catch (error) {
    console.error('getUrlsByHashPrefix', error.message);
    throw error;
  }
};

// write the URL to the database
const persistUrl = async ({ url, hash, shortHash }) => {
  try {
    const result = await db.insertHashedUrl({ url, hash, shortHash });
    return result;
  } catch (error) {
    console.error('persistUrl', error.message);
    throw error;
  }
};

// Reset the update date time for the URL in the database to now
const resetUrl = async ({ shortHash }) => {
  try {
    const result = await db.resetHashedUrl({ shortHash });
    return result;
  } catch (error) {
    console.error('resetUrl', error.message);
    throw error;
  }
};

// returns boolean indicating if a provided string matches any members of an array
const isUnique = ({ str, arr }) => !arr.every(el => (el !== str));

// return the shortest substring of the hash that is unique
const determineUniqueShortHash = ({ hash, matches }) => {
  try {
    let unique = false;
    let shortHash = hash.substring(0, IDEAL_HASH_LENGTH);
    const remainder = hash.substring(IDEAL_HASH_LENGTH).split('');
    const matchHashes = matches.map(el => el.shortHash);
    while (unique === false && remainder.length > 0) {
      shortHash = `${shortHash}${remainder.shift()}`;
      unique = isUnique({ str: shortHash, arr: matchHashes });
    }
    return shortHash;
  } catch (error) {
    console.error('determineUniqueShortHash', error.message);
    throw error;
  }
};

// create a hash from a provided url string
const generateHash = async ({ url }) => {
  try {
    if (!validateUrl({ url })) {
      return { result: {
          url,
          message: 'Url is invalid',
          status: 'failure'
        }
      }
    }
    const parsedUrl = new Url(url);
    const { origin, pathname, query } = parsedUrl;

    const sortedQuery = sortQuerystring({ query });

    const normalizedUrl = `${origin}${pathname}${sortedQuery}`;
    const hash = hashUrl({ url: normalizedUrl });

    const shortHash = hash.substring(0, IDEAL_HASH_LENGTH);
    const matches = await getUrlsByHashPrefix({ hash: shortHash });
    let status;
    let message;
    if (matches.length > 0) {
      // at least one URL with a matching short hash exists in the database
      if (isUnique({ str: normalizedUrl, arr: matches.map(el => el.url) })) {
        // the entered URL is unique, but the short hash is not
        const uniqueHash = determineUniqueShortHash({ hash, matches });

        // save the new url with that shortest possbile unique hash
        await persistUrl({ url, hash, shortHash: uniqueHash });
        console.warn(`Short hash conflict. New url created using ${uniqueHash} instead of ${shortHash}`);
        message = 'New url created.';
        status = 'create';
      } else {
        // url is a duplicate of an existing url. Update valid and updated values
        await resetUrl({ shortHash });
        message = 'Existing url reset.';
        status = 'update';
      }
    } else {
      // the provided url is unique
      await persistUrl({ url, hash, shortHash });
      message = 'New url created.';
      status = 'create';
    }
    return {
      result: {
        url,
        hash,
        shortHash,
        message,
        status,
      },
    };
  } catch (error) {
    console.error('generateHash', error.message);
    throw error;
  }
};

module.exports = {
  generateHash,
  getUrls,
  getUrlByHash,
  resetUrl
};
