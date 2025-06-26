const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String },
  description: { type: String },
  contact: { type: String },
  issuesReported: { type: Number, default: 0 },
  issuesResolved: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 