const mongoose = require('mongoose');
const { schemaOptions, getPrice, setPrice } = require('../utils');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 100,
      required: true,
    },
    ingredients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ingredient',
      },
    ],
    price: {
      type: Number,
      required: true,
      get: getPrice,
      set: setPrice,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  schemaOptions,
);

module.exports = mongoose.model('burger', schema);
