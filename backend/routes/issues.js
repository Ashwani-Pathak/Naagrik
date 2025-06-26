const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const { auth, isAdmin } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const CATEGORY_EMAILS = {
  'Road': 'municipal_corp@example.com',
  'Pothole': 'municipal_corp@example.com',
  'Lighting': 'bescom@example.com',
  'Electricity': 'bescom@example.com',
  // Add more categories and authority emails as needed
};

// GET /issues - anyone can view
router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('createdBy', 'username email role avatar')
      .populate('comments.createdBy', 'username avatar');
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /issues - logged-in users only
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, photo, location } = req.body;
    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const issue = new Issue({
      title,
      description,
      category,
      photo,
      location,
      createdBy: req.user.userId
    });
    await issue.save();

    // Determine recipients
    const authorityEmail = CATEGORY_EMAILS[category] || null;
    const recipients = [process.env.ADMIN_EMAIL];
    if (authorityEmail) recipients.push(authorityEmail);

    // Send email to admin and authority
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    await transporter.sendMail({
      from: `Local Issues Map <${process.env.SMTP_USER}>`,
      to: recipients.join(','),
      subject: 'New Issue Reported',
      html: `<h3>New Issue Reported</h3>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Location:</strong> ${location.lat}, ${location.lng}</p>
        <p><strong>Reported by User ID:</strong> ${req.user.userId}</p>`
    });

    res.status(201).json(issue);
  } catch (err) {
    console.error('Error in POST /issues:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /issues/:id/status - admin only
router.put('/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /issues/:id - admin only
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json({ message: 'Issue deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /issues/:id/upvote - anyone can upvote
router.post('/:id/upvote', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /issues/:id/comments - anyone can comment
router.post('/:id/comments', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required' });
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    const comment = { text };
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        comment.createdBy = decoded.userId;
      } catch {}
    }
    issue.comments.push(comment);
    await issue.save();
    res.status(201).json(issue.comments[issue.comments.length - 1]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 