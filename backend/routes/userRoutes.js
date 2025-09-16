const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Routes
router.post("/forgot-password", userController.forgotPassword);
router.post("/login", userController.loginUser);
router.post("/check-email", userController.checkEmail);
router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/:id", userController.getUserById);

module.exports = router;

