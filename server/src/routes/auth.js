const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/schema');
const { JWT_SECRET, authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/register/host', async (req, res) => {
  const { name, email, password, bio, location } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });
  if (db.get('hosts').find({ email }).value()) return res.status(409).json({ error: 'Email already registered' });

  const id = uuidv4();
  const hashed = await bcrypt.hash(password, 10);
  const user = { id, name, email, password: hashed, bio: bio || null, location: location || null, created_at: new Date().toISOString() };
  db.get('hosts').push(user).write();

  const token = jwt.sign({ id, role: 'host', name, email }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _pw, ...safe } = user;
  res.json({ token, user: { ...safe, role: 'host' } });
});

router.post('/register/traveller', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });
  if (db.get('travellers').find({ email }).value()) return res.status(409).json({ error: 'Email already registered' });

  const id = uuidv4();
  const hashed = await bcrypt.hash(password, 10);
  const user = { id, name, email, password: hashed, phone: phone || null, created_at: new Date().toISOString() };
  db.get('travellers').push(user).write();

  const token = jwt.sign({ id, role: 'traveller', name, email }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _pw, ...safe } = user;
  res.json({ token, user: { ...safe, role: 'traveller' } });
});

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) return res.status(400).json({ error: 'Email, password and role required' });

  const collection = role === 'host' ? 'hosts' : 'travellers';
  const user = db.get(collection).find({ email }).value();
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _pw, ...safe } = user;
  res.json({ token, user: { ...safe, role } });
});

router.get('/me', authMiddleware, (req, res) => {
  const collection = req.user.role === 'host' ? 'hosts' : 'travellers';
  const user = db.get(collection).find({ id: req.user.id }).value();
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _pw, ...safe } = user;
  res.json({ ...safe, role: req.user.role });
});

router.put('/profile', authMiddleware, async (req, res) => {
  const { name, bio, location, phone } = req.body;
  const collection = req.user.role === 'host' ? 'hosts' : 'travellers';
  const update = req.user.role === 'host'
    ? { name: name || undefined, bio: bio !== undefined ? bio : undefined, location: location !== undefined ? location : undefined }
    : { name: name || undefined, phone: phone !== undefined ? phone : undefined };

  Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);
  db.get(collection).find({ id: req.user.id }).assign(update).write();

  const user = db.get(collection).find({ id: req.user.id }).value();
  const { password: _pw, ...safe } = user;
  res.json({ ...safe, role: req.user.role });
});

module.exports = router;
