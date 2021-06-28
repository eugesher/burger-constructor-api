const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  bun: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bun',
    required: 'true',
  },
  filling: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'filling',
  }],
});

module.exports = mongoose.model('user', userSchema);
