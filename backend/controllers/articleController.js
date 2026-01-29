const Article = require("../models/Article");
const mongoose = require("mongoose");

// Get all articles with optional filtering
exports.getAllArticles = async (req, res) => {
  try {
    const { 
      status, 
      category, 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build filter query
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Fetch articles with pagination
    const articles = await Article.find(filter)
      .populate('createdBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Article.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        articles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalArticles: total,
          articlesPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error("Get all articles error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch articles",
      error: error.message
    });
  }
};

// Get article statistics
exports.getArticleStats = async (req, res) => {
  try {
    // Overview stats
    const totalArticles = await Article.countDocuments();
    const publishedArticles = await Article.countDocuments({ status: 'published' });
    const draftArticles = await Article.countDocuments({ status: 'draft' });
    const underReviewArticles = await Article.countDocuments({ status: 'under_review' });

    // Aggregate views, downloads, and citations
    const aggregateStats = await Article.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalDownloads: { $sum: '$downloads' },
          totalCitations: { $sum: '$citations' }
        }
      }
    ]);

    const { totalViews = 0, totalDownloads = 0, totalCitations = 0 } = 
      aggregateStats[0] || {};

    // Category distribution
    const categoryStats = await Article.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Monthly publication trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Article.aggregate([
      {
        $match: {
          status: 'published',
          publishedAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$publishedAt' },
            month: { $month: '$publishedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalArticles,
          publishedArticles,
          draftArticles,
          underReviewArticles,
          totalViews,
          totalDownloads,
          totalCitations
        },
        categoryStats,
        monthlyStats
      }
    });
  } catch (error) {
    console.error("Get article stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch article statistics",
      error: error.message
    });
  }
};

// Get article by ID
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID"
      });
    }

    const article = await Article.findById(id)
      .populate('createdBy', 'name email');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    // Increment view count
    article.views += 1;
    await article.save();

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error("Get article by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch article",
      error: error.message
    });
  }
};

// Create new article
exports.createArticle = async (req, res) => {
  try {
    const articleData = {
      ...req.body,
      createdBy: req.user.id
    };

    const article = new Article(articleData);
    await article.save();

    const populatedArticle = await Article.findById(article._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: populatedArticle
    });
  } catch (error) {
    console.error("Create article error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create article",
      error: error.message
    });
  }
};

// Update article
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID"
      });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    // Check if user is authorized to update (creator or admin)
    if (article.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this article"
      });
    }

    // Update article
    Object.assign(article, req.body);
    
    // Set published date if status changed to published
    if (req.body.status === 'published' && !article.publishedAt) {
      article.publishedAt = new Date();
    }

    await article.save();

    const updatedArticle = await Article.findById(id)
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      data: updatedArticle
    });
  } catch (error) {
    console.error("Update article error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update article",
      error: error.message
    });
  }
};

// Delete article
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID"
      });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    // Check if user is authorized to delete (creator or admin)
    if (article.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this article"
      });
    }

    await Article.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Article deleted successfully"
    });
  } catch (error) {
    console.error("Delete article error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete article",
      error: error.message
    });
  }
};

// Submit article for peer review
exports.submitForReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID"
      });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    // Check if user is authorized
    if (article.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to submit this article"
      });
    }

    // Check if article is in draft status
    if (article.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: "Only draft articles can be submitted for review"
      });
    }

    // Update status
    article.status = 'under_review';
    article.peerReview.status = 'in_progress';
    await article.save();

    res.status(200).json({
      success: true,
      message: "Article submitted for peer review successfully",
      data: article
    });
  } catch (error) {
    console.error("Submit for review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit article for review",
      error: error.message
    });
  }
};

// Add peer review
exports.addPeerReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, comments, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID"
      });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found"
      });
    }

    // Add review
    article.peerReview.reviewers.push({
      name,
      email,
      comments,
      rating,
      reviewedAt: new Date()
    });

    await article.save();

    res.status(200).json({
      success: true,
      message: "Peer review added successfully",
      data: article
    });
  } catch (error) {
    console.error("Add peer review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add peer review",
      error: error.message
    });
  }
};