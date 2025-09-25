const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const { authenticateToken } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateToken);

// Article routes
router.get("/", articleController.getAllArticles);
router.get("/stats", articleController.getArticleStats);
router.get("/:id", articleController.getArticleById);
router.post("/", articleController.createArticle);
router.put("/:id", articleController.updateArticle);
router.delete("/:id", articleController.deleteArticle);

// Peer review routes
router.post("/:id/submit-review", articleController.submitForReview);
router.post("/:id/peer-review", articleController.addPeerReview);

module.exports = router;





