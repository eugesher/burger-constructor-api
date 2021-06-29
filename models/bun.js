const mongoose = require('mongoose');
const validator = require('validator');

const bunSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    validate: validator.isInt,
  },
});

module.exports = mongoose.model('bun', bunSchema);
