const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, company } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hash, company });
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user._id, email: user.email, firstName: user.firstName } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Demo login bypass
    if (email === 'demo@nexusai.in' && password === 'demo1234') {
      const token = jwt.sign({ userId: 'demo', email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, token, user: { id: 'demo', email, firstName: 'Demo' } });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user._id, email: user.email, firstName: user.firstName } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
