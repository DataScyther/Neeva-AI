const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['cbt', 'mindfulness', 'breathing', 'journaling', 'other']
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  content: {
    type: String, // Markdown or HTML content
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Indexes for better query performance
exerciseSchema.index({ category: 1 });
exerciseSchema.index({ tags: 1 });
exerciseSchema.index({ createdAt: 1 });

// Middleware to update the updatedAt field
exerciseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Exercise', exerciseSchema);