const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  suplier: {
    type: String,
    required: true,
  },
  unit: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
