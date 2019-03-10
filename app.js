const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const moment = require('moment');

const routes = require('./routes');
const urlController = require('./controllers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api', routes);

// shortened URLs expire after 14 days without use
const URL_DURATION = 14;

/* GET urls by hash. */
app.get('/:shortHash', async (req, res, next) => {
  try {
    const { shortHash } = req.params;
    const result = await urlController.getUrlByHash({ shortHash });
    console.log('TIMMY', result, shortHash);
    if (result) {
      // determine if URL is still active
      const now = moment();
      const lastUpdated = moment(result.updatedttm);
      const daysSinceUpdate = moment.duration(now.diff(lastUpdated)).asDays();
      if (daysSinceUpdate > URL_DURATION) {
        return next(new Error('The short url you used has expired'));
      }
      // Asynchronosuly update updatedttm for url to avoid expiry
      urlController.resetUrl({ shortHash });
      return res.redirect(result.url);
    }
    return next(new Error('The short url you used is invalid'));
  } catch (error) {
    console.error('get - /:shortHash', error.message);
    return next(error);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message, status: err.status });
});

module.exports = app;
