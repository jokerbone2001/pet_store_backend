const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const ProductSchema  = new Schema({
  name: String,
  amount: Number,
  price: Number,
  feature: [String], // Array of strings
  description: String,
  images: [String] // Array of strings
});

module.exports = mongoose.model('products', ProductSchema );