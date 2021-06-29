const mongoose = require('mongoose');
const validator = require('validator');
const { getPrice, setPrice } = require('../utils');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['cutlet', 'vegetable', 'sauce', 'other'],
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

module.exports = mongoose.model('ingredient', ingredientSchema);
