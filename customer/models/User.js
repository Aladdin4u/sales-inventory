const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  address: [{ type: mongoose.Types.ObjectId, ref: "Address", require: true }],
  cart: [
    {
      product: {
        _id: { type: String, require: true },
        name: { type: String },
        banner: { type: String },
        price: { type: Number },
      },
      unit: { type: Number, require: true },
    },
  ],
  wishlist: [
    {
      _id: { type: String, require: true },
      name: { type: String },
      description: { type: String },
      banner: { type: String },
      avalable: { type: Boolean },
      price: { type: Number },
    },
  ],
  orders: [
    {
      _id: { type: String, required: true },
      amount: { type: String },
      date: { type: Date, default: Date.now() },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
