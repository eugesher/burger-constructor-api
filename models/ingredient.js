const { Schema, model } = require('mongoose');

const {
  schemaOptions, setName, getPrice, setPrice,
} = require('../utils');

const ingredientSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 100,
    required: true,
    unique: true,
    set: setName,
  },
  category: {
    type: String,
    enum: ['buns', 'cutlets', 'cheeses', 'vegetables', 'sauces'],
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

module.exports = model('ingredient', ingredientSchema);
