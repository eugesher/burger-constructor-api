const mongoose = require('mongoose');

const {
  schemaOptions, ingredientCategories, setName, getPrice, setPrice,
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
    enum: ingredientCategories,
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
