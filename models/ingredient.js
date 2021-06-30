const mongoose = require('mongoose');

const {
  schemaOptions, setName, getPrice, setPrice,
} = require('../utils');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    set: setName,
  },
  category: {
    type: String,
    enum: ['bun', 'cutlet', 'vegetable', 'sauce', 'other'],
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
}, schemaOptions);

module.exports = mongoose.model('ingredient', ingredientSchema);
