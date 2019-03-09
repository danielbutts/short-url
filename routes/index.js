const express = require('express');
const db = require('../services/dbService');
const urlController = require('../controllers');

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

/* Generate a hash from a URL */
router.post('/generate', async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) throw new Error('The post body must contain a url');
    const hash = urlController.generateHash({ url });
    res.json(hash);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
