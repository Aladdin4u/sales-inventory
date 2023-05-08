const express = require("express");
const shoppingController = require("../controllers/shopping");
const { verifyUser, verifyAdmin } = require("../middlewares/verifyToken");
const router = express.Router();

//Create
router.post("/", verifyUser, shoppingController.placeOrder);
//Update
router.put("/:id", verifyUser, shoppingController.updateShopping);
//Delete
router.delete("/:id", verifyUser, shoppingController.deleteShopping);
//Get
router.get("/:id", verifyUser, shoppingController.getShopping);
//GetAll
router.get("/", verifyUser, shoppingController.getCart);

module.exports = router;
