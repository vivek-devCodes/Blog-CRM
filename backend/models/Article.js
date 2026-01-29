const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  content: { 
    type: String,   
    required: true,
    trim: true
  },
  abstract: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 500
  },
  authors: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    affiliation: { type: String }
  }],
  keywords: [{
    type: String,
    trim: true
  }],
  category: { 
    type: String, 
    required: true,
    enum: ['Research', 'Review', 'Case Study', 'Tutorial', 'Opinion', 'News', 'Analysis', 'Other'],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  featuredImage: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'under_review', 'published', 'rejected', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  citations: {
    type: Number,
    default: 0
  },
  doi: {
    type: String,
    sparse: true
  },
  volume: {
    type: String
  },
  issue: {
    type: String
  },
  pages: {
    start: String,
    end: String
  },
  references: [{
    title: String,
    authors: String,
    journal: String,
    year: Number,
    doi: String,
    url: String
  }],
  peerReview: {
    reviewers: [{
      name: String,
      email: String,
      comments: String,
      rating: Number,
      reviewedAt: Date
    }],
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    }
  },
  seoTitle: {
    type: String,
    trim: true
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: 160
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true 
});

// Index for better search performance
articleSchema.index({ title: 'text', content: 'text', abstract: 'text' });
articleSchema.index({ category: 1, status: 1 });
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ doi: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Article", articleSchema);

