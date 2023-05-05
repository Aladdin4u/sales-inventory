const User = require("../models/User");
const bcrypt = require("bcrypt");
const { createError } = require("../utils/error");
const jwk = require("jsonwebtoken");

module.exports = {
  register: async (req, res, next) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const newUser = new User({
        ...req.body,
        password: hash,
      });

      await newUser.save();
      res.status(201).send(newUser);
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return next(createError(404, "User not found!"));
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect)
        return createError(400, "Wrong password or email!");

      const token = jwk.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT
      );
      const { password, isAdmin, ...otherDetails } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ ...otherDetails });
    } catch (error) {
      next(error);
    }
  },
};
