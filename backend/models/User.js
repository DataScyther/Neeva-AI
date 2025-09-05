const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  age: {
    type: Number,
    min: 13
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      daily: { type: Boolean, default: true },
      weekly: { type: Boolean, default: true },
      exercises: { type: Boolean, default: true },
      community: { type: Boolean, default: false }
    }
  },
  mentalHealthData: {
    moodEntries: [{
      mood: { type: Number, min: 1, max: 5 },
      timestamp: { type: Date, default: Date.now },
      notes: String
    }],
    exercises: [{
      exerciseId: mongoose.Schema.Types.ObjectId,
      completed: { type: Boolean, default: false },
      streak: { type: Number, default: 0 },
      lastCompleted: Date
    }],
    chatHistory: [{
      sessionId: String,
      messages: [{
        role: String,
        content: String,
        timestamp: { type: Date, default: Date.now }
      }]
    }]
  }
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: 1 });

module.exports = mongoose.model('User', userSchema);