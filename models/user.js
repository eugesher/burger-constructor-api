const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');

const { schemaOptions } = require('../utils');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: isEmail,
  },
  // password: {
  //   type: String,
  //   required: true,
  //   select: false,
  // },
}, schemaOptions);

module.exports = model('user', userSchema);
