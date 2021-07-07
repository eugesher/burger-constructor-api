const { Schema, model } = require('mongoose');

const { ObjectId } = Schema.Types;

const schema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 100,
    required: true,
  },
  ingredients: [{
    type: ObjectId,
    ref: 'ingredient',
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

module.exports = model('burger', schema);
