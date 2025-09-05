const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  notes: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  activities: [{
    type: String,
    trim: true
  }],
  timestamp: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  }
});

// Indexes for better query performance
moodEntrySchema.index({ userId: 1, timestamp: -1 });
moodEntrySchema.index({ timestamp: 1 });
moodEntrySchema.index({ mood: 1 });

module.exports = mongoose.model('MoodEntry', moodEntrySchema);