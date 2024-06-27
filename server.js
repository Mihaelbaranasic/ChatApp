const express = require('express');
const sesija = require('express-session');
const WebSocket = require('ws');
const FetchUpravitelj = require('./aplikacija/fetchUpravitelj');
const restKorisnik = require('./servis/upravljanjeBazom/restKorisnik');
const restKontakt = require('./servis/upravljanjeBazom/restKontakt');

const server = express();
const port = 3000;
const fetchUpravitelj = new FetchUpravitelj(port);

server.use(sesija({
  secret: 'abc', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use('/css', express.static('./aplikacija/css'));
server.use('/js', express.static('./aplikacija/js'));


server.get('/', fetchUpravitelj.glavna.bind(fetchUpravitelj));
server.get('/prijava', fetchUpravitelj.prijava.bind(fetchUpravitelj));
server.get('/registracija', fetchUpravitelj.registracija.bind(fetchUpravitelj));
server.post('/prijava', fetchUpravitelj.prijava.bind(fetchUpravitelj));
server.post('/registracija', fetchUpravitelj.registracija.bind(fetchUpravitelj));

server.get('/baza/korisnici', restKorisnik.getKorisnici);
server.post('/baza/korisnici', restKorisnik.postKorisnici);
server.delete("/baza/korisnici", restKorisnik.deleteKorisnici);
server.put("/baza/korisnici", restKorisnik.putKorisnici);
server.get("/baza/korisnici/:korime", restKorisnik.getKorisnik);
server.post("/baza/korisnici/:korime", restKorisnik.postKorisnik);
server.delete("/baza/korisnici/:korime", restKorisnik.deleteKorisnik);
server.put("/baza/korisnici/:korime", restKorisnik.putKorisnik);
server.post("/baza/korisnici/:korime/prijava", restKorisnik.getKorisnikPrijava);


server.get("/baza/nisuKontakti/:korime", restKorisnik.getNisuKontakti);

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
