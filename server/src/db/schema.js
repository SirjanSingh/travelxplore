const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATA_DIR
  ? path.join(process.env.DATA_DIR, 'db.json')
  : path.join(__dirname, '../../db.json');

// Ensure directory exists before lowdb tries to write
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const adapter = new FileSync(dbPath);
const db = low(adapter);

db.defaults({ hosts: [], travellers: [], offerings: [], bookings: [] }).write();

module.exports = db;
