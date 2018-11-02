'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TotalSchema = new Schema({
  total: Number
});

module.exports = mongoose.model('Total', TotalSchema);
