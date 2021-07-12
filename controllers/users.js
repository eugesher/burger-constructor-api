const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../erorrs/not-found-error');
const BadRequestError = require('../erorrs/bad-request-error');
const ConflictError = require('../erorrs/conflict-error');
const { concatenateErrorMessages } = require('../utils');

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (user) res.json(user);
      else throw new NotFoundError('user not found');
    })
    .catch((err) => next(
      err.kind === 'ObjectId'
        ? new BadRequestError('invalid user id')
        : err,
    ));
};

module.exports.createUser = (req, res, next) => {
  const { email } = req.body;

  User.create({ email })
    .then((user) => res.json(user))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-key',
        { expiresIn: '7d' },
      );
      res.json({ token });
    })
    .catch((err) => {
      const { message } = err;
      res.status(401).json({ message });
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('missing email or password ');
  }

  bcrypt.hash(password, 8)
    .then((passwordHash) => User.create({
      email,
      password: passwordHash,
    }))
    .then((user) => {
      const u = user.toObject();
      delete u.password;
      res.json(u);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('email has already been registered'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(concatenateErrorMessages(err)));
      } else {
        next(err);
      }
    });
};
