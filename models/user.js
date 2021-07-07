const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');

const { schemaOptions } = require('../utils');

const schema = new Schema({
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

module.exports = model('user', schema);
