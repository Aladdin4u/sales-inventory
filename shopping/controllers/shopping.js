const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { CreateChannel } = require("../utils/rabbitMQ");
const channel = CreateChannel();

module.exports = {
  createCart: async (req, res, next) => {
    const newCart = new Cart(req.body);

    try {
      const savedCart = await newCart.save();
      res.status(200).json(savedCart);
    } catch (error) {
      next(error);
    }
  },
  updateCart: async (req, res, next) => {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedCart);
    } catch (error) {
      next(error);
    }
  },
  deleteCart: async (req, res, next) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json("Cart has been deleted");
    } catch (error) {
      next(error);
    }
  },
  getCart: async (req, res, next) => {
    try {
      const Cart = await Cart.findById(req.params.id).populate("address");
      res.status(200).json(Cart);
    } catch (error) {
      next(error);
    }
  },
  getAllCart: async (req, res, next) => {
    try {
      const Carts = await Cart.find();
      res.status(200).json(Carts);
    } catch (error) {
      next(error);
    }
  },
};
