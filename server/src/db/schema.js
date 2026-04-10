const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(process.env.DATA_DIR ? path.join(process.env.DATA_DIR, 'db.json') : path.join(__dirname, '../../db.json'));
const db = low(adapter);

db.defaults({ hosts: [], travellers: [], offerings: [], bookings: [] }).write();

module.exports = db;
