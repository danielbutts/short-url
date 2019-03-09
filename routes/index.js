const express = require('express');
const db = require('../services/dbService');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.json({ route: 'index' });
});

/* GET url by hash. */
router.get('/:hash', async (req, res, next) => {
  try {
    const { hash } = req.params;
    const result = await db.getUrlsByHash({ hash });
    res.json({ hash, result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
