// routes/auth.js — Register & Login
// ─────────────────────────────────────────────
// Phase 2: replace stubs with real DB logic
// ─────────────────────────────────────────────
const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const router  = express.Router();

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, mobile, password, role, district } = req.body;

    if (!name || !mobile || !password || !role || !district) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await User.findOne({ mobile });
    if (exists) return res.status(409).json({ message: 'Mobile already registered' });

    const user  = await User.create({ name, mobile, password, role, district });
    const token = signToken(user._id);

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { uid, password } = req.body;

    if (!uid || !password) {
      return res.status(400).json({ message: 'UID and password required' });
    }

    const user = await User.findOne({ uid }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid UID or password' });
    }

    const token = signToken(user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
