const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

// /tmp is always writable; fall back to local path in dev
const dbPath = process.env.NODE_ENV === 'production'
  ? '/tmp/db.json'
  : path.join(__dirname, '../../db.json');

const adapter = new FileSync(dbPath);
const db = low(adapter);

db.defaults({ hosts: [], travellers: [], offerings: [], bookings: [] }).write();

module.exports = db;
