const express = require('express');
const Comment = require('../models/comment.model.js');

const router = express.Router();

router.get('/projects/:projectId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load comments' });
  }
});


// backend/routes/comment.router.js
router.post('/projects/:projectId/comments', async (req, res, next) => {
  try {
    const { name, text } = req.body;
    const { projectId } = req.params;

    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const newComment = await Comment.create({
      projectId,
      name: name || 'Anonymous',
      text,
    });

    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Delete a comment
router.delete("/projects/:projectId/comments/:commentId", async (req, res) => {
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.commentId);
    if (!deleted) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
});



// Update a comment
router.put("/projects/:projectId/comments/:commentId", async (req, res) => {
  try {
    const { name, text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const updated = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { name, text },
      { new: true } 
    );

    if (!updated) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update comment" });
  }
});


//create Reply
router.post('/projects/:projectId/comments/:commentId/reply', async (req, res) => {
  try {
    const { projectId, commentId } = req.params;
    const { name, text } = req.body || {};

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Reply text is required' });
    }

    const comment = await Comment.findOne({ _id: commentId, projectId });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const reply = {
      name: name?.trim() || 'Anonymous',
      text: text.trim(),
      createdAt: new Date(),
    };

    comment.replies = comment.replies || [];
    comment.replies.push(reply);

    await comment.save();

    res.status(201).json(comment);
  } catch (err) {
    console.error('POST reply error:', err);
    res.status(500).json({ error: 'Failed to post reply' });
  }
});

// Update reply
router.put("/projects/:projectId/comments/:commentId/reply/:replyId", async (req, res) => {
  const { commentId, replyId } = req.params;
  const { text } = req.body;

  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, "replies._id": replyId },
      { $set: { "replies.$.text": text } },
      { new: true }
    );
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete reply
router.delete("/projects/:projectId/comments/:commentId/reply/:replyId", async (req, res) => {
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.replyId);
    if (!deleted) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
});


module.exports = router;
