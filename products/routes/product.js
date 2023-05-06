const express = require("express");
const productController = require("../controllers/product");
const { verifyAdmin, verifyUser } = require("../middlewares/verifyToken");
const router = express.Router();

//Create
router.post("/", verifyAdmin, productController.createProduct);
//Update
router.put("/wishlist/:userId", verifyUser, productController.updateWishlist);
router.put("/:id", verifyAdmin, productController.updateProduct);
//Delete
router.delete("/:id", verifyAdmin, productController.deleteProduct);
//Get
router.get("/:id", productController.getProduct);
//GetAll
router.get("/category/:type", productController.getProductCategory);
router.get("/", productController.getAllProduct);

module.exports = router;
