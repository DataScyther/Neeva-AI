const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['general', 'support', 'discussion', 'resources', 'success-stories']
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  isAnonymous: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
communityPostSchema.index({ category: 1, createdAt: -1 });
communityPostSchema.index({ tags: 1 });
communityPostSchema.index({ userId: 1 });

// Middleware to update the updatedAt field
communityPostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);