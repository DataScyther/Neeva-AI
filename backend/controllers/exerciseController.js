const Exercise = require('../models/Exercise');
const User = require('../models/User');

// @desc    Get all exercises
// @route   GET /api/exercises
// @access  Public
const getExercises = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
            { tags: { $in: [req.query.keyword] } }
          ]
        }
      : {};

    const category = req.query.category
      ? { category: req.query.category }
      : {};

    const difficulty = req.query.difficulty
      ? { difficulty: req.query.difficulty }
      : {};

    const query = { ...keyword, ...category, ...difficulty, isActive: true };

    const count = await Exercise.countDocuments(query);
    const exercises = await Exercise.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      exercises,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get exercise by ID
// @route   GET /api/exercises/:id
// @access  Public
const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (exercise && exercise.isActive) {
      res.json(exercise);
    } else {
      res.status(404).json({ message: 'Exercise not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new exercise
// @route   POST /api/exercises
// @access  Private/Admin
const createExercise = async (req, res) => {
  try {
    const { title, description, category, duration, difficulty, content, tags } = req.body;

    const exercise = new Exercise({
      title,
      description,
      category,
      duration,
      difficulty,
      content,
      tags
    });

    const createdExercise = await exercise.save();
    res.status(201).json(createdExercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an exercise
// @route   PUT /api/exercises/:id
// @access  Private/Admin
const updateExercise = async (req, res) => {
  try {
    const { title, description, category, duration, difficulty, content, tags, isActive } = req.body;

    const exercise = await Exercise.findById(req.params.id);

    if (exercise) {
      exercise.title = title || exercise.title;
      exercise.description = description || exercise.description;
      exercise.category = category || exercise.category;
      exercise.duration = duration || exercise.duration;
      exercise.difficulty = difficulty || exercise.difficulty;
      exercise.content = content || exercise.content;
      exercise.tags = tags || exercise.tags;
      exercise.isActive = isActive !== undefined ? isActive : exercise.isActive;

      const updatedExercise = await exercise.save();
      res.json(updatedExercise);
    } else {
      res.status(404).json({ message: 'Exercise not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an exercise
// @route   DELETE /api/exercises/:id
// @access  Private/Admin
const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (exercise) {
      await exercise.remove();
      res.json({ message: 'Exercise removed' });
    } else {
      res.status(404).json({ message: 'Exercise not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user exercise progress
// @route   PUT /api/exercises/:id/progress
// @access  Private
const updateUserExerciseProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const exerciseId = req.params.id;
    const { completed } = req.body;

    if (user) {
      const exerciseIndex = user.mentalHealthData.exercises.findIndex(
        ex => ex.exerciseId.toString() === exerciseId
      );

      if (exerciseIndex !== -1) {
        // Update existing exercise progress
        user.mentalHealthData.exercises[exerciseIndex].completed = completed;
        user.mentalHealthData.exercises[exerciseIndex].lastCompleted = completed ? new Date() : null;
        
        if (completed) {
          user.mentalHealthData.exercises[exerciseIndex].streak += 1;
        }
      } else {
        // Add new exercise progress
        user.mentalHealthData.exercises.push({
          exerciseId,
          completed,
          streak: completed ? 1 : 0,
          lastCompleted: completed ? new Date() : null
        });
      }

      const updatedUser = await user.save();
      res.json(updatedUser.mentalHealthData.exercises);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  updateUserExerciseProgress
};