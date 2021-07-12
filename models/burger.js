const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 100,
    required: true,
  },
  ingredients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ingredient',
  }],
  price: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('burger', schema);
