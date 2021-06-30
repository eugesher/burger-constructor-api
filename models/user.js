const mongoose = require('mongoose');
const validator = require('validator');

const { schemaOptions } = require('../utils');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },
  // password: {
  //   type: String,
  //   required: true,
  //   select: false,
  // },
}, schemaOptions);

module.exports = mongoose.model('user', userSchema);
