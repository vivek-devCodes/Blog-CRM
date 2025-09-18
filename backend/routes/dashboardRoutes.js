const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { authenticateToken } = require("../middleware/auth");

// Protected dashboard routes (authentication required)
router.get("/", authenticateToken, dashboardController.getDashboard);

module.exports = router;
