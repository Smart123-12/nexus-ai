const mongoose = require('mongoose');
const UploadSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  size: Number,
  mimetype: String,
  path: String,
  userId: { type: String, default: 'demo' },
  status: { type: String, enum: ['uploaded','processing','analyzed','error'], default: 'uploaded' },
  analysisResult: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Upload', UploadSchema);
