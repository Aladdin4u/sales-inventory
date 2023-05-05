const express = require("express");
const userController = require("../controllers/shopping");
const { verifyUser, verifyAdmin } = require("../middlewares/verifyToken");
const router = express.Router();

//Create
router.post("/", userController.createUser);
//Update
router.put("/:id", verifyUser, userController.updateUser);
//Delete
router.delete("/:id", verifyUser, userController.deleteUser);
//Get
router.get("/:id", verifyUser, userController.getUser);
//GetAll
router.get("/", verifyAdmin, userController.getAllUser);

module.exports = router;
