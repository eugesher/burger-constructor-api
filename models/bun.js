const mongoose = require('mongoose');

const { getPrice, setName, setPrice } = require('../utils');

const bunSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    set: setName,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    get: getPrice,
    set: setPrice,
  },
}, { toJSON: { getters: true } });

module.exports = mongoose.model('bun', bunSchema);
