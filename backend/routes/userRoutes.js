const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");

// Public routes (no authentication required)
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.post("/login", userController.loginUser);
router.post("/check-email", userController.checkEmail);
router.post("/", userController.createUser);
router.post("/logout", userController.logoutUser);

// Protected routes (authentication required)
router.get("/verify", authenticateToken, userController.verifyAuth);
router.get("/stats", authenticateToken, userController.getUserStats);
router.get("/", authenticateToken, userController.getUsers);
router.put("/:id", authenticateToken, userController.updateUser);
router.delete("/:id", authenticateToken, userController.deleteUser);
router.get("/:id", authenticateToken, userController.getUserById);

module.exports = router;

