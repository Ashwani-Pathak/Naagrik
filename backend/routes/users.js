const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const multer = require('multer');

// Multer config for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Get current user profile
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({
    username: user.username,
    email: user.email,
    description: user.description || '',
    contact: user.contact || '',
    avatar: user.avatar || '',
    issuesReported: user.issuesReported || 0,
    issuesResolved: user.issuesResolved || 0
  });
});

// Update profile
router.put('/me', auth, async (req, res) => {
  const { description, contact } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { description, contact },
    { new: true }
  );
  res.json({
    username: user.username,
    email: user.email,
    description: user.description || '',
    contact: user.contact || '',
    avatar: user.avatar || '',
    issuesReported: user.issuesReported || 0,
    issuesResolved: user.issuesResolved || 0
  });
});

// Upload avatar
router.post('/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const avatarUrl = `/uploads/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { avatar: avatarUrl },
    { new: true }
  );
  res.json({ avatar: avatarUrl });
});

module.exports = router; 