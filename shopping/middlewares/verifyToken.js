const jwt = require("jsonwebtoken");
const { createError } = require("../utils/error");

module.exports = {
  verifyUser: (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return next(createError(401, "You are not authenticated!"));
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) return next(createError(403, "Token is not valid!"));
      req.user = user;
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        if (err) return next(createError(403, "You are not authorized!"));
      }
      next();
    });
  },

  verifyAdmin: (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return next(createError(401, "You are not authenticated!"));
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) return next(createError(403, "Token is not valid!"));
      req.user = user;
      if (req.user.isAdmin) {
        next();
      } else {
        if (err) return next(createError(403, "You are not authorized!"));
      }
      next();
    });
  },
};
