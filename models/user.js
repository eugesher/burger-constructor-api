const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../erorrs/unauthorized-error');

const { schemaOptions } = require('../utils');

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  schemaOptions,
);

function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => (user
      ? bcrypt.compare(password, user.password)
      : Promise.reject(new UnauthorizedError('wrong email or password'))
        .then((matched) => (matched
          ? user
          : Promise.reject(new UnauthorizedError('wrong email or password'))
        ))
    ));
}

schema.statics = { findUserByCredentials };

module.exports = mongoose.model('user', schema);
