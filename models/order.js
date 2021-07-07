const { Schema, model } = require('mongoose');

const { ObjectId } = Schema.Types;

const schema = new Schema({
  list: [{
    type: ObjectId,
    ref: 'burger',
  }],
  price: {
    type: Number,
    required: true,
  },
  owner: {
    type: ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = model('order', schema);
