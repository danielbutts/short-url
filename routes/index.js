const express = require('express');
const urlController = require('../controllers');

const router = express.Router();

/* GET all urls. */
router.get('/urls', async (req, res, next) => {
  try {
    const urls = await urlController.getUrls();
    res.json({ urls });
  } catch (error) {
    next(error);
  }
});

/* Generate a hash from a URL */
router.post('/generate', async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) throw new Error('The post body must contain a url');
    const hash = await urlController.generateHash({ url });
    res.json(hash);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
