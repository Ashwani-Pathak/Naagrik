const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  photo: String,
  location: {
    lat: Number,
    lng: Number
  },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  upvotes: { type: Number, default: 0 },
  comments: [commentSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema); 