const express = require("express");
const shoppingController = require("../controllers/shopping");
const { verifyUser, verifyAdmin } = require("../middlewares/verifyToken");
const router = express.Router();

//Create
router.post("/order", verifyUser, shoppingController.placeOrder);
//Update
router.put("/cart", verifyUser, shoppingController.updateShopping);
//Delete
router.delete("/:id", verifyUser, shoppingController.deleteShopping);
//Get
router.get("/:id", verifyUser, shoppingController.getShopping);
//Get
router.get("/cart", verifyUser, shoppingController.getCart);
router.get("/order", verifyUser, shoppingController.getOrder);

module.exports = router;
