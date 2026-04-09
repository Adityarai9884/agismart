// routes/users.js
const express = require('express');
const User    = require('../models/User');
const { protect, requireRole } = require('../middleware/auth');
const router  = express.Router();

// GET /api/users/me      — current user profile
router.get('/me', protect, (req, res) => res.json(req.user));

// GET /api/users/:uid    — look up user by UID (incharge use)
router.get('/:uid', protect, requireRole('incharge','admin'), async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;


// ──────────────────────────────────────────────
// routes/transport.js
// ──────────────────────────────────────────────
