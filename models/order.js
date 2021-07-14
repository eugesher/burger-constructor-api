const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  list: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'burger',
    },
  ],
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

module.exports = mongoose.model('order', schema);
