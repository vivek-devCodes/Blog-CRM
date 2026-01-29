const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
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
  excerpt: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 300
  },
  author: { 
    type: String, 
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Technology', 'Lifestyle', 'Travel', 'Food', 'Fashion', 'Health', 'Education', 'Business', 'Other'],
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
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    name: String,
    email: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
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
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
blogSchema.index({ slug: 1 }, { unique: true });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ publishedAt: -1 });

// Generate slug from title before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);

