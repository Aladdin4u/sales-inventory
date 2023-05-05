const express = require("express");
const addressController = require("../controllers/address");
const { verifyUser } = require("../middlewares/verifyToken");
const router = express.Router();

//Create
router.post("/:userId", verifyUser, addressController.createAddress);
//Update
router.put("/:id", verifyUser, addressController.updateAddress);
//Delete
router.delete("/:id", verifyUser, addressController.deleteAddress);

module.exports = router;
