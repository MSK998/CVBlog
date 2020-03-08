const mongoose = require("mongoose");

const sectionSchema = mongoose.Schema({
  _id: String,
  title: String,
  main: [String]
});

const cvSchema = mongoose.Schema({
  _id: String,
  section: [sectionSchema]
});

module.exports = mongoose.model('CV', cvSchema);
