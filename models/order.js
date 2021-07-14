const mongoose = require('mongoose');

const { schemaOptions, getPrice, setPrice } = require('../utils');

const schema = new mongoose.Schema(
  {
    list: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'burger',
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

module.exports = mongoose.model('order', schema);
