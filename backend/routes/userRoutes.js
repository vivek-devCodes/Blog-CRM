const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Routes
router.post("/login", userController.loginUser);
router.post("/check-email", userController.checkEmail);
router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
