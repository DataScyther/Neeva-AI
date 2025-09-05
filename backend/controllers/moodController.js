const MoodEntry = require('../models/MoodEntry');
const User = require('../models/User');

// @desc    Get mood entries for a user
// @route   GET /api/mood
// @access  Private
const getMoodEntries = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    const filter = { userId: req.user._id };
    
    // Filter by date range if provided
    if (req.query.startDate && req.query.endDate) {
      filter.timestamp = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      filter.timestamp = {
        $gte: new Date(req.query.startDate)
      };
    } else if (req.query.endDate) {
      filter.timestamp = {
        $lte: new Date(req.query.endDate)
      };
    }

    const count = await MoodEntry.countDocuments(filter);
    const moodEntries = await MoodEntry.find(filter)
      .sort({ timestamp: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      moodEntries,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new mood entry
// @route   POST /api/mood
// @access  Private
const createMoodEntry = async (req, res) => {
  try {
    const { mood, notes, tags, activities, location } = req.body;

    const moodEntry = new MoodEntry({
      userId: req.user._id,
      mood,
      notes,
      tags,
      activities,
      location
    });

    const createdMoodEntry = await moodEntry.save();
    
    // Also update the user's mental health data
    const user = await User.findById(req.user._id);
    if (user) {
      user.mentalHealthData.moodEntries.push({
        mood,
        notes,
        tags,
        activities,
        timestamp: createdMoodEntry.timestamp
      });
      await user.save();
    }

    res.status(201).json(createdMoodEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get mood statistics
// @route   GET /api/mood/stats
// @access  Private
const getMoodStats = async (req, res) => {
  try {
    const filter = { userId: req.user._id };
    
    // Filter by date range if provided
    if (req.query.startDate && req.query.endDate) {
      filter.timestamp = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      filter.timestamp = {
        $gte: new Date(req.query.startDate)
      };
    } else if (req.query.endDate) {
      filter.timestamp = {
        $lte: new Date(req.query.endDate)
      };
    }

    const moodEntries = await MoodEntry.find(filter);
    
    if (moodEntries.length === 0) {
      return res.json({
        averageMood: 0,
        moodDistribution: {},
        totalEntries: 0,
        streak: 0
      });
    }

    // Calculate statistics
    const totalMood = moodEntries.reduce((sum, entry) => sum + entry.mood, 0);
    const averageMood = totalMood / moodEntries.length;
    
    // Mood distribution
    const moodDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    moodEntries.forEach(entry => {
      moodDistribution[entry.mood]++;
    });
    
    // Calculate streak (consecutive days with entries)
    const sortedEntries = moodEntries.sort((a, b) => a.timestamp - b.timestamp);
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = sortedEntries.length - 1; i >= 0; i--) {
      const entryDate = new Date(sortedEntries[i].timestamp);
      entryDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      
      if (entryDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (entryDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    res.json({
      averageMood: parseFloat(averageMood.toFixed(1)),
      moodDistribution,
      totalEntries: moodEntries.length,
      streak
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a mood entry
// @route   DELETE /api/mood/:id
// @access  Private
const deleteMoodEntry = async (req, res) => {
  try {
    const moodEntry = await MoodEntry.findById(req.params.id);

    if (moodEntry) {
      if (moodEntry.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      
      await moodEntry.remove();
      res.json({ message: 'Mood entry removed' });
    } else {
      res.status(404).json({ message: 'Mood entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMoodEntries,
  createMoodEntry,
  getMoodStats,
  deleteMoodEntry
};