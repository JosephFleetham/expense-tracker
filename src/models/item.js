'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  id: Number,
  subtraction: Boolean,
  type: String,
  note: String,
  price: Number,
  itemDate: String
});

module.exports = mongoose.model('Item', ItemSchema);
