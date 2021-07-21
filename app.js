require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { validateAuthRequest } = require('./middlewares/validations');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const router = require('./routes');
const NotFoundError = require('./erorrs/not-found-error');
const errorHandler = require('./erorrs/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/burgersdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.post('/signin', validateAuthRequest, login);
app.post('/signup', validateAuthRequest, createUser);
app.use(auth);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use((req, res, next) => next(new NotFoundError('not found')));
app.use(errorHandler);

app.listen(PORT);
