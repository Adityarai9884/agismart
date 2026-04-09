// routes/transport.js
const express   = require('express');
const Transport = require('../models/Transport');
const { protect, requireRole } = require('../middleware/auth');
const router    = express.Router();

// POST /api/transport/suggest — Returns vehicle type for given weight (no auth needed)
router.post('/suggest', (req, res) => {
  const { kg } = req.body;
  if (!kg || isNaN(kg)) return res.status(400).json({ message: 'kg is required' });
  const vehicle = Transport.suggestVehicle(Number(kg));
  res.json({ kg, vehicle });
});

// POST /api/transport/book — Farmer books transport
router.post('/book', protect, requireRole('farmer'), async (req, res) => {
  try {
    const { cropId, weightKg, toMandi } = req.body;
    const vehicleType = Transport.suggestVehicle(weightKg);
    const booking = await Transport.create({
      farmerId:     req.user._id,
      farmerUid:    req.user.uid,
      cropId,
      weightKg,
      vehicleType,
      fromDistrict: req.user.district,
      toMandi,
    });
    res.status(201).json(booking);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET /api/transport/arrivals — Incharge sees pending arrivals
router.get('/arrivals', protect, requireRole('incharge'), async (req, res) => {
  try {
    const arrivals = await Transport.find({ status: { $in: ['en-route','confirmed'] } })
      .populate('farmerId', 'name uid');
    res.json(arrivals);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/transport/:id/approve — Incharge approves gate entry
router.patch('/:id/approve', protect, requireRole('incharge'), async (req, res) => {
  try {
    const t = await Transport.findByIdAndUpdate(req.params.id, {
      status: 'arrived', arrivedAt: new Date(), approvedBy: req.user.uid,
    }, { new: true });
    res.json(t);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
