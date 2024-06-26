require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('Povezan na bazu podataka');
});

pool.on('error', (err) => {
  console.error('Greška u vezi s bazom podataka:', err);
});

module.exports = pool;
