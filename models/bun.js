import { getPrice, setName, setPrice } from '../utils';

const mongoose = require('mongoose');
const validator = require('validator');

const bunSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    set: setName,
  },
  availableQuantity: {
    type: Number,
    required: true,
    validate: validator.isInt,
  },
  price: {
    type: Number,
    required: true,
    get: getPrice,
    set: setPrice,
  },
});

module.exports = mongoose.model('bun', bunSchema);
