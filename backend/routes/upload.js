const router = require('express').Router();
const Upload = require('../models/Upload');

module.exports = (upload) => {
  router.post('/', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
      const doc = await Upload.create({
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: req.file.path,
        userId: req.body.userId || 'demo',
        status: 'uploaded'
      });
      res.json({ success: true, upload: doc, message: 'File uploaded successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/history', async (req, res) => {
    try {
      const uploads = await Upload.find({ userId: req.query.userId || 'demo' })
        .sort({ createdAt: -1 }).limit(20);
      res.json({ uploads });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
