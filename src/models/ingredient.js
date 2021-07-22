const mongoose = require('mongoose');

const {
  schemaOptions, ingredientCategories, setName, getPrice, setPrice,
} = require('../utils');

const schema = new mongoose.Schema(
  {
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
  },
  schemaOptions,
);

module.exports = mongoose.model('ingredient', schema);
