const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const Issue = require('../models/Issue');

// DELETE /comments/:id - admin only
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const commentId = req.params.id;
    // Find the issue containing this comment
    const issue = await Issue.findOne({ 'comments._id': commentId });
    if (!issue) return res.status(404).json({ message: 'Comment or issue not found' });
    // Remove the comment
    issue.comments.id(commentId).remove();
    await issue.save();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 