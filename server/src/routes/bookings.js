const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/schema');
const { requireHost, requireTraveller } = require('../middleware/auth');

const router = express.Router();

// Create booking (traveller)
router.post('/', requireTraveller, (req, res) => {
  const { offering_id, check_in, check_out, guests, customization_request, special_notes } = req.body;
  if (!offering_id) return res.status(400).json({ error: 'Offering ID required' });

  const offering = db.get('offerings').find({ id: offering_id }).value();
  if (!offering) return res.status(404).json({ error: 'Offering not found' });

  let days = 1;
  if (check_in && check_out) {
    const d1 = new Date(check_in), d2 = new Date(check_out);
    days = Math.max(1, Math.ceil((d2 - d1) / 86400000));
  }
  const total_price = offering.price * days * (parseInt(guests) || 1);

  const booking = {
    id: uuidv4(), offering_id, traveller_id: req.user.id,
    check_in: check_in || null, check_out: check_out || null,
    guests: parseInt(guests) || 1, total_price, status: 'pending',
    customization_request: customization_request || null,
    special_notes: special_notes || null,
    created_at: new Date().toISOString(),
  };
  db.get('bookings').push(booking).write();
  res.status(201).json(booking);
});

// Traveller's own bookings
router.get('/mine', requireTraveller, (req, res) => {
  const bookings = db.get('bookings').filter({ traveller_id: req.user.id }).value();
  const enriched = bookings.map(b => {
    const o = db.get('offerings').find({ id: b.offering_id }).value() || {};
    const h = db.get('hosts').find({ id: o.host_id }).value() || {};
    return {
      ...b,
      offering_title: o.title, offering_type: o.type,
      offering_location: o.location, offering_images: o.images || [],
      offering_price: o.price, host_name: h.name,
    };
  });
  res.json([...enriched].reverse());
});

// Host's bookings
router.get('/host', requireHost, (req, res) => {
  const myOfferings = db.get('offerings').filter({ host_id: req.user.id }).map('id').value();
  const bookings = db.get('bookings').filter(b => myOfferings.includes(b.offering_id)).value();
  const enriched = bookings.map(b => {
    const o = db.get('offerings').find({ id: b.offering_id }).value() || {};
    const t = db.get('travellers').find({ id: b.traveller_id }).value() || {};
    return {
      ...b,
      offering_title: o.title, offering_type: o.type,
      offering_location: o.location, offering_price: o.price,
      traveller_name: t.name, traveller_email: t.email, traveller_phone: t.phone,
    };
  });
  res.json([...enriched].reverse());
});

// Update status (host)
router.patch('/:id/status', requireHost, (req, res) => {
  const { status } = req.body;
  if (!['confirmed', 'cancelled', 'completed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const booking = db.get('bookings').find({ id: req.params.id }).value();
  if (!booking) return res.status(404).json({ error: 'Not found' });

  const offering = db.get('offerings').find({ id: booking.offering_id }).value();
  if (!offering || offering.host_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

  db.get('bookings').find({ id: req.params.id }).assign({ status }).write();
  res.json({ ...booking, status });
});

// Cancel (traveller)
router.patch('/:id/cancel', requireTraveller, (req, res) => {
  const booking = db.get('bookings').find({ id: req.params.id, traveller_id: req.user.id }).value();
  if (!booking) return res.status(404).json({ error: 'Not found' });
  if (booking.status !== 'pending') return res.status(400).json({ error: 'Can only cancel pending bookings' });

  db.get('bookings').find({ id: req.params.id }).assign({ status: 'cancelled' }).write();
  res.json({ ...booking, status: 'cancelled' });
});

module.exports = router;
