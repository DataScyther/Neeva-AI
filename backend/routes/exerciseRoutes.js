const express = require('express');
const router = express.Router();
const {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  updateUserExerciseProgress
} = require('../controllers/exerciseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getExercises)
  .post(protect, admin, createExercise);

router.route('/:id')
  .get(getExerciseById)
  .put(protect, admin, updateExercise)
  .delete(protect, admin, deleteExercise);

router.route('/:id/progress')
  .put(protect, updateUserExerciseProgress);

module.exports = router;