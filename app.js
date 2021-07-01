const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const router = require('./routes');
const NotFoundError = require('./erorrs/not-found-error');
const errorHandler = require('./erorrs/error-handler');

const { PORT = 3000 } = process.env;
const app = express();

// noinspection JSIgnoredPromiseFromCall
mongoose.connect('mongodb://localhost:27017/burgersdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '60d9e793860bfa3caa38d71f',
  };
  next();
});
app.use(router);
app.use((req, res, next) => {
  next(new NotFoundError('not found'));
});
app.use(errorHandler);

app.listen(PORT);
