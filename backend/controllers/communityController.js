const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');

// @desc    Get all community posts
// @route   GET /api/community
// @access  Public
const getCommunityPosts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { content: { $regex: req.query.keyword, $options: 'i' } },
            { tags: { $in: [req.query.keyword] } }
          ]
        }
      : {};

    const category = req.query.category
      ? { category: req.query.category }
      : {};

    const query = { ...keyword, ...category };

    const count = await CommunityPost.countDocuments(query);
    const posts = await CommunityPost.find(query)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      posts,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get community post by ID
// @route   GET /api/community/:id
// @access  Public
const getCommunityPostById = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new community post
// @route   POST /api/community
// @access  Private
const createCommunityPost = async (req, res) => {
  try {
    const { title, content, category, tags, isAnonymous } = req.body;

    // Get user info
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = new CommunityPost({
      userId: req.user._id,
      username: isAnonymous ? 'Anonymous' : user.name,
      title,
      content,
      category,
      tags,
      isAnonymous
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a community post
// @route   PUT /api/community/:id
// @access  Private
const updateCommunityPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    const post = await CommunityPost.findById(req.params.id);

    if (post) {
      if (post.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      post.title = title || post.title;
      post.content = content || post.content;
      post.category = category || post.category;
      post.tags = tags || post.tags;

      const updatedPost = await post.save();
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a community post
// @route   DELETE /api/community/:id
// @access  Private
const deleteCommunityPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (post) {
      if (post.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await post.remove();
      res.json({ message: 'Post removed' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/community/:id/comment
// @access  Private
const addCommentToPost = async (req, res) => {
  try {
    const { content } = req.body;

    const post = await CommunityPost.findById(req.params.id);

    if (post) {
      // Get user info
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const comment = {
        userId: req.user._id,
        username: user.name,
        content
      };

      post.comments.push(comment);
      const updatedPost = await post.save();
      res.status(201).json(updatedPost.comments[updatedPost.comments.length - 1]);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a post
// @route   POST /api/community/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (post) {
      // Check if user has already liked the post
      const alreadyLiked = post.likes.find(
        like => like.userId.toString() === req.user._id.toString()
      );

      if (alreadyLiked) {
        // Remove like
        post.likes = post.likes.filter(
          like => like.userId.toString() !== req.user._id.toString()
        );
      } else {
        // Add like
        post.likes.push({
          userId: req.user._id
        });
      }

      const updatedPost = await post.save();
      res.json({
        likes: updatedPost.likes.length,
        liked: !alreadyLiked
      });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCommunityPosts,
  getCommunityPostById,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
  addCommentToPost,
  likePost
};