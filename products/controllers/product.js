const Product = require("../models/Product");
const { CreateChannel } = require("../utils/rabbitMQ");
const channel = CreateChannel();

module.exports = {
  createProduct: async (req, res, next) => {
    const newProduct = new Product(req.body);

    try {
      const savedProduct = await newProduct.save();
      res.status(200).json(savedProduct);
    } catch (error) {
      next(error);
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },
  updateWishlist: async (req, res, next) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      PublishMessage(channel, process.env.CUSTOMER_SERVICE, JSON.stringify(data));
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json("Product has been deleted");
    } catch (error) {
      next(error);
    }
  },
  getProduct: async (req, res, next) => {
    try {
      const Product = await Product.findById(req.params.id)
      res.status(200).json(Product);
    } catch (error) {
      next(error);
    }
  },
  getAllProduct: async (req, res, next) => {
    try {
      const Products = await Product.find();
      res.status(200).json(Products);
    } catch (error) {
      next(error);
    }
  },
  getProductCategory: async (req, res, next) => {
    try {
      const Products = await Product.find({type: req.params.type});
      res.status(200).json(Products);
    } catch (error) {
      next(error);
    }
  },
};
