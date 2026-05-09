require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nexusai')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('⚠️ MongoDB error:', err.message));

// File upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'));
  }
});

// Routes
app.use('/api/upload',   require('./routes/upload')(upload));
app.use('/api/analyze',  require('./routes/analyze'));
app.use('/api/report',   require('./routes/report'));
app.use('/api/chat',     require('./routes/chat'));
app.use('/api/contact',  require('./routes/contact'));
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/dashboard',require('./routes/dashboard'));
app.use('/api/analytics',require('./routes/analytics'));

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', service: 'Nexus AI API', version: '1.0.0' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Create uploads dir if not exists
const fs = require('fs');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

app.listen(PORT, () => console.log(`🚀 Nexus AI server running on port ${PORT}`));
module.exports = app;
