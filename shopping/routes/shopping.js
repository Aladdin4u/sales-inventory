const express = require("express");
const shoppingController = require("../controllers/shopping");
const { verifyUser, verifyAdmin } = require("../middlewares/verifyToken");
const router = express.Router();

//Create
router.post("/", shoppingController.createShopping);
//Update
router.put("/:id", verifyUser, shoppingController.updateShopping);
//Delete
router.delete("/:id", verifyUser, shoppingController.deleteShopping);
//Get
router.get("/:id", verifyUser, shoppingController.getShopping);
//GetAll
router.get("/", verifyAdmin, shoppingController.getAllShoppings);

module.exports = router;
