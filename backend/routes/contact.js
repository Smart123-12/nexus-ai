const router = require('express').Router();
const Contact = require('../models/Contact');
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, company, type, message } = req.body;
    if (!firstName || !email || !message) {
      return res.status(400).json({ error: 'First name, email, and message are required' });
    }

    // Save to MongoDB
    const contact = await Contact.create({ firstName, lastName, email, company, type, message });

    // Send to Google Sheets via Apps Script
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (scriptUrl && scriptUrl !== 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
      await axios.post(scriptUrl, {
        action: 'newContact',
        data: { firstName, lastName, email, company, type, message, timestamp: new Date().toISOString() }
      }).catch(e => console.log('Google Sheets sync failed:', e.message));
    }

    res.json({ success: true, message: 'Message received! We\'ll respond within 24 hours.', id: contact._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(50);
    res.json({ contacts, total: contacts.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
