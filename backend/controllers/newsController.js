const News = require('../models/News');

// Get all news articles
exports.getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, search } = req.query;
    const query = {};

    // Add filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$text = { $search: search };
    }

    const news = await News.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await News.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        news,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch news articles'
    });
  }
};

// Get single news article
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    // Increment views
    news.views += 1;
    await news.save();

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch news article'
    });
  }
};

// Create new news article
exports.createNews = async (req, res) => {
  try {
    const newsData = {
      ...req.body,
      createdBy: req.user._id
    };

    // Set publishedAt if status is published
    if (newsData.status === 'published') {
      newsData.publishedAt = new Date();
    }

    const news = new News(newsData);
    await news.save();

    const populatedNews = await News.findById(news._id).populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'News article created successfully',
      data: populatedNews
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create news article'
    });
  }
};

// Update news article
exports.updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    // Check if user is the creator or admin
    if (news.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this news article'
      });
    }

    const updateData = { ...req.body };

    // Set publishedAt if status is being changed to published
    if (updateData.status === 'published' && news.status !== 'published') {
      updateData.publishedAt = new Date();
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'News article updated successfully',
      data: updatedNews
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update news article'
    });
  }
};

// Delete news article
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    // Check if user is the creator or admin
    if (news.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this news article'
      });
    }

    await News.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'News article deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete news article'
    });
  }
};

// Get news statistics
exports.getNewsStats = async (req, res) => {
  try {
    const stats = await News.aggregate([
      {
        $group: {
          _id: null,
          totalNews: { $sum: 1 },
          publishedNews: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          },
          draftNews: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
          },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' }
        }
      }
    ]);

    const categoryStats = await News.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalNews: 0,
          publishedNews: 0,
          draftNews: 0,
          totalViews: 0,
          totalLikes: 0
        },
        categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch news statistics'
    });
  }
};

