const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/schema');
const { requireHost } = require('../middleware/auth');

const router = express.Router();

// Public: list with filters
router.get('/', (req, res) => {
  const { location, type, search } = req.query;
  let items = db.get('offerings').value();

  if (location) items = items.filter(o => o.location?.toLowerCase().includes(location.toLowerCase()));
  if (type && type !== 'all') items = items.filter(o => o.type === type);
  if (search) items = items.filter(o =>
    o.title?.toLowerCase().includes(search.toLowerCase()) ||
    o.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Attach host info
  const hosts = db.get('hosts').value();
  items = items.map(o => {
    const h = hosts.find(h => h.id === o.host_id) || {};
    return { ...o, host_name: h.name, host_location: h.location, host_bio: h.bio };
  });

  res.json(items.reverse());
});

// Public: single offering
router.get('/host/mine', requireHost, (req, res) => {
  const items = db.get('offerings').filter({ host_id: req.user.id }).value();
  res.json([...items].reverse());
});

router.get('/:id', (req, res) => {
  const o = db.get('offerings').find({ id: req.params.id }).value();
  if (!o) return res.status(404).json({ error: 'Offering not found' });
  const h = db.get('hosts').find({ id: o.host_id }).value() || {};
  res.json({ ...o, host_name: h.name, host_location: h.location, host_bio: h.bio, host_avatar: h.avatar });
});

// Create (host)
router.post('/', requireHost, (req, res) => {
  const { title, description, type, price, location, images, available_from, available_to, max_guests, is_customizable, customization_note } = req.body;
  if (!title || !description || !type || !price || !location) return res.status(400).json({ error: 'Required fields missing' });

  const id = uuidv4();
  const offering = {
    id, host_id: req.user.id, title, description, type,
    price: parseFloat(price), location,
    images: images || [],
    available_from: available_from || null, available_to: available_to || null,
    max_guests: parseInt(max_guests) || 1,
    is_customizable: !!is_customizable,
    customization_note: customization_note || null,
    created_at: new Date().toISOString(),
  };
  db.get('offerings').push(offering).write();
  res.status(201).json(offering);
});

// Update (host, own)
router.put('/:id', requireHost, (req, res) => {
  const o = db.get('offerings').find({ id: req.params.id }).value();
  if (!o) return res.status(404).json({ error: 'Not found' });
  if (o.host_id !== req.user.id) return res.status(403).json({ error: 'Not your offering' });

  const { title, description, type, price, location, images, available_from, available_to, max_guests, is_customizable, customization_note } = req.body;
  const update = {};
  if (title !== undefined) update.title = title;
  if (description !== undefined) update.description = description;
  if (type !== undefined) update.type = type;
  if (price !== undefined) update.price = parseFloat(price);
  if (location !== undefined) update.location = location;
  if (images !== undefined) update.images = images;
  if (available_from !== undefined) update.available_from = available_from;
  if (available_to !== undefined) update.available_to = available_to;
  if (max_guests !== undefined) update.max_guests = parseInt(max_guests);
  if (is_customizable !== undefined) update.is_customizable = !!is_customizable;
  if (customization_note !== undefined) update.customization_note = customization_note;

  db.get('offerings').find({ id: req.params.id }).assign(update).write();
  res.json(db.get('offerings').find({ id: req.params.id }).value());
});

// Delete (host, own)
router.delete('/:id', requireHost, (req, res) => {
  const o = db.get('offerings').find({ id: req.params.id }).value();
  if (!o) return res.status(404).json({ error: 'Not found' });
  if (o.host_id !== req.user.id) return res.status(403).json({ error: 'Not your offering' });

  db.get('bookings').remove({ offering_id: req.params.id }).write();
  db.get('offerings').remove({ id: req.params.id }).write();
  res.json({ message: 'Deleted' });
});

module.exports = router;
