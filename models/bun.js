const mongoose = require('mongoose');
const validator = require('validator');

const bunSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  availableQuantity: {
    type: Number,
    required: true,
    validate: validator.isInt,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('bun', bunSchema);
