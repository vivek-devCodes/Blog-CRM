const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const { authenticateToken } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateToken);

// News routes
router.get("/", newsController.getAllNews);
router.get("/stats", newsController.getNewsStats);
router.get("/:id", newsController.getNewsById);
router.post("/", newsController.createNews);
router.put("/:id", newsController.updateNews);
router.delete("/:id", newsController.deleteNews);

module.exports = router;

