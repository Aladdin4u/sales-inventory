const Address = require("../models/Address");
const User = require("../models/User");

module.exports = {
  createAddress: async (req, res, next) => {
    try {
      const profile = await User.findById(req.params.userId) 
      const newAddress = new Address(req.body);
      if(profile) {
        await newAddress.save();
        profile.address.push(newAddress._id)
        await profile.save()
      }
      res.status(201).json(newAddress);
    } catch (error) {
      next(error);
    }
  },
  updateAddress: async (req, res, next) => {
    try {
      const updatedAddress = await Address.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedAddress);
    } catch (error) {
      next(error);
    }
  },
  deleteAddress: async (req, res, next) => {
    try {
      await Address.findByIdAndDelete(req.params.id);
      res.status(204).json("Address has been deleted");
    } catch (error) {
      next(error);
    }
  },
};
