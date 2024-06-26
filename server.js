require('dotenv').config();
const express = require('express');
const sesija = require('express-session');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const pool = require('./baza/baza');

const server = express();
const port = process.env.PORT || 3000;

server.use(sesija({
  secret: 'abc', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

const initDatabase = async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'baza', 'init.sql')).toString();
    await pool.query(sql);
    console.log('Baza podataka je inicijalizirana');
  } catch (err) {
    console.error('Greška pri inicijalizaciji baze podataka:', err);
  }
};

initDatabase();

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Novi WebSocket klijent povezan');

  ws.on('message', (message) => {
    console.log(`Primljena poruka: ${message}`);
    ws.send('Poruka primljena');
  });

  ws.on('close', () => {
    console.log('WebSocket klijent se odspojio');
  });
});

server.listen(port, () => {
  console.log(`Server je pokrenut na http://localhost:${port}`);
});
