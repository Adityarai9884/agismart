// routes/crops.js
const express  = require('express');
const Crop     = require('../models/Crop');
const { protect, requireRole } = require('../middleware/auth');
const router   = express.Router();

// GET  /api/crops          — Browse all active listings (public)
router.get('/', async (req, res) => {
  try {
    const { district, name } = req.query;
    const filter = { status: 'active' };
    if (district) filter.district = district;
    if (name)     filter.name = new RegExp(name, 'i');
    const crops = await Crop.find(filter).sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/crops          — Farmer lists a crop
router.post('/', protect, requireRole('farmer'), async (req, res) => {
  try {
    const crop = await Crop.create({
      ...req.body,
      farmerId: req.user._id,
      farmerUid: req.user.uid,
      district: req.user.district,
    });
    res.status(201).json(crop);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET  /api/crops/mine     — Farmer's own listings
router.get('/mine', protect, requireRole('farmer'), async (req, res) => {
  try {
    const crops = await Crop.find({ farmerId: req.user._id });
    res.json(crops);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/crops/:id/status — Update status (incharge/admin)
router.patch('/:id/status', protect, requireRole('incharge','admin'), async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(crop);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
