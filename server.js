const express = require('express');
const sesija = require('express-session');
const WebSocket = require('ws');
const FetchUpravitelj = require('./aplikacija/fetchUpravitelj');
const restKorisnik = require('./servis/upravljanjeBazom/restKorisnik');
const restKontakt = require('./servis/upravljanjeBazom/restKontakt');
const restPoruka = require('./servis/upravljanjeBazom/restPoruke');
const restDatoteka = require('./servis/upravljanjeBazom/restDatoteka');
const http = require('http');

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
server.use('/uploads', express.static('uploads')); // Serve static files

server.use('/css', express.static('./aplikacija/css'));
server.use('/js', express.static('./aplikacija/js'));

server.get('/', fetchUpravitelj.glavna.bind(fetchUpravitelj));
server.get('/prijava', fetchUpravitelj.prijava.bind(fetchUpravitelj));
server.get('/registracija', fetchUpravitelj.registracija.bind(fetchUpravitelj));
server.post('/prijava', fetchUpravitelj.prijava.bind(fetchUpravitelj));
server.post('/registracija', fetchUpravitelj.registracija.bind(fetchUpravitelj));
server.get('/odjava', fetchUpravitelj.odjava.bind(fetchUpravitelj));

server.get('/baza/korisnici', restKorisnik.getKorisnici);
server.post('/baza/korisnici', restKorisnik.postKorisnici);
server.delete('/baza/korisnici', restKorisnik.deleteKorisnici);
server.put('/baza/korisnici', restKorisnik.putKorisnici);
server.get('/baza/korisnici/:korime', restKorisnik.getKorisnik);
server.post('/baza/korisnici/:korime', restKorisnik.postKorisnik);
server.delete('/baza/korisnici/:korime', restKorisnik.deleteKorisnik);
server.put('/baza/korisnici/:korime', restKorisnik.putKorisnik);
server.post('/baza/korisnici/:korime/prijava', restKorisnik.getKorisnikPrijava);
server.post("/baza/korisnici/obavjesti", restKorisnik.saveNotifications);


server.get('/baza/nisuKontakti/:korime', restKorisnik.getNisuKontakti);

server.get('/baza/kontakti/:korime', restKontakt.getKontakti);
server.post('/baza/kontakti/:korime', restKontakt.postKontakti);

server.get('/baza/poruke/:posiljatelj/:primatelj', restPoruka.dajPoruke);
server.post('/baza/poruke', restPoruka.posaljiPoruku);

server.get('/baza/datoteke/:posiljatelj/:primatelj', restDatoteka.dajDatoteke);
server.post('/baza/datoteke', restDatoteka.posaljiDatoteku);

const httpServer = http.createServer(server);
const wss = new WebSocket.Server({ server: httpServer });

wss.on('connection', (ws, req) => {
  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    if (data.type === 'new_message') {
      const { posiljatelj, primatelj, sadrzaj } = data;
      const zahtjev = {
        body: { posiljatelj, primatelj, sadrzaj }
      };
      const odgovor = {
        type: (type) => {},
        status: (status) => {},
        send: (data) => {}
      };
      await restPoruka.posaljiPoruku(zahtjev, odgovor);

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'new_message', posiljatelj, primatelj, sadrzaj, vrijemeSlanja: new Date() }));
        }
      });
    } else if (data.type === 'new_file') {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'new_file',
            posiljatelj: data.posiljatelj,
            primatelj: data.primatelj,
            naziv: data.naziv,
            putanja: data.putanja,
            vrijemePrimitka: new Date()
          }));
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('WebSocket klijent se odspojio');
  });
});

httpServer.listen(port, () => {
  console.log(`Server je pokrenut na http://localhost:${port}`);
});