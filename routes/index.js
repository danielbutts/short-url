const express = require('express');
const moment = require('moment');
const urlController = require('../controllers');

const router = express.Router();
const URL_DURATION = 14;

/* GET base route. */
router.get('/', (req, res) => {
  res.json({ route: 'index' });
});

/* GET all urls. */
router.get('/urls', async (req, res, next) => {
  try {
    const urls = await urlController.getUrls();
    res.json({ urls });
  } catch (error) {
    next(error);
  }
});

/* GET urls by hash. */
router.get('/:hash', async (req, res, next) => {
  try {
    const { hash } = req.params;
    const result = await urlController.getUrlByHash({ hash });
    if (result) {
      const now = moment();
      const lastUpdated = moment(result.updatedttm);
      const daysSinceUpdate = moment.duration(now.diff(lastUpdated)).asDays();
      if (daysSinceUpdate > URL_DURATION) {
        return next(new Error('The short url you used has expired'));
      }
      return res.redirect(result.url);
    }
    return next(new Error('The short url you used is invalid'));
  } catch (error) {
    return next(error);
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
