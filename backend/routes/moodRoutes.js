const express = require('express');
const router = express.Router();
const {
  getMoodEntries,
  createMoodEntry,
  getMoodStats,
  deleteMoodEntry
} = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMoodEntries)
  .post(protect, createMoodEntry);

router.route('/stats')
  .get(protect, getMoodStats);

router.route('/:id')
  .delete(protect, deleteMoodEntry);

module.exports = router;