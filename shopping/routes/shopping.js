const express = require("express");
const shoppingController = require("../controllers/shopping");
const { verifyshopping, verifyAdmin } = require("../middlewares/verifyToken");
const router = express.Router();

//Create
router.post("/", shoppingController.createShopping);
//Update
router.put("/:id", verifyshopping, shoppingController.updateShopping);
//Delete
router.delete("/:id", verifyshopping, shoppingController.deleteShopping);
//Get
router.get("/:id", verifyshopping, shoppingController.getShopping);
//GetAll
router.get("/", verifyAdmin, shoppingController.getAllShoppings);

module.exports = router;
