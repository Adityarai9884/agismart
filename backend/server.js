// server.js — Express Entry Point
// ─────────────────────────────────────────────
// STATUS: Phase 2 stub — wire up in Phase 2
// ─────────────────────────────────────────────
require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();

// ── Middleware ────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ── Routes (Phase 2) ─────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/crops',     require('./routes/crops'));
app.use('/api/transport', require('./routes/transport'));

// ── Health check ──────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', phase: 1, message: 'AgriSmart API running' });
});

// ── DB + Server ───────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agrismart';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🌿 AgriSmart API on http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB error:', err));
