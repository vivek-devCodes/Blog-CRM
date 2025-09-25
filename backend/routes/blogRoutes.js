const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { authenticateToken } = require("../middleware/auth");

// Public routes (no authentication required)
router.get("/slug/:slug", blogController.getBlogBySlug);
router.post("/:id/comments", blogController.addComment);

// Protected routes (authentication required)
router.use(authenticateToken);

// Blog routes
router.get("/", blogController.getAllBlogs);
router.get("/stats", blogController.getBlogStats);
router.get("/:id", blogController.getBlogById);
router.post("/", blogController.createBlog);
router.put("/:id", blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

module.exports = router;

