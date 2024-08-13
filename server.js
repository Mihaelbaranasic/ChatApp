const express = require('express');
const sesija = require('express-session');
const WebSocket = require('ws');
const FetchUpravitelj = require('./aplikacija/fetchUpravitelj');
const restKorisnik = require('./servis/upravljanjeBazom/restKorisnik');
const restKontakt = require('./servis/upravljanjeBazom/restKontakt');
const restPoruka = require('./servis/upravljanjeBazom/restPoruke');
const restDatoteka = require('./servis/upravljanjeBazom/restDatoteka');
const restDnevnik = require('./servis/upravljanjeBazom/restDnevnik');
const restStatistika = require('./servis/upravljanjeBazom/restStatistika');
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
pokreniServer();
pripremiPutanjeKorisnik();
pripremiPutanjeKontakt();
pripremiPutanjePorukeIDatoteke();
pripremiPutanjeDnevnik();

function pokreniServer(){
  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());
  server.use('/uploads', express.static('uploads'));

  server.use('/css', express.static('./aplikacija/css'));
  server.use('/js', express.static('./aplikacija/js'));

  server.get('/', fetchUpravitelj.glavna.bind(fetchUpravitelj));
  server.get('/prijava', fetchUpravitelj.prijava.bind(fetchUpravitelj));
  server.get('/registracija', fetchUpravitelj.registracija.bind(fetchUpravitelj));
  server.post('/prijava', fetchUpravitelj.prijava.bind(fetchUpravitelj));
  server.post('/registracija', fetchUpravitelj.registracija.bind(fetchUpravitelj));
  server.get('/odjava', fetchUpravitelj.odjava.bind(fetchUpravitelj));
  server.get('/profil', fetchUpravitelj.profil.bind(fetchUpravitelj));
  server.get('/statistika', fetchUpravitelj.statistika.bind(fetchUpravitelj));
  server.get('/statistika-admin', fetchUpravitelj.statistikaAdmin.bind(fetchUpravitelj));
  server.get('/dnevnik', fetchUpravitelj.dnevnik.bind(fetchUpravitelj));
  server.get('/korisnici', fetchUpravitelj.korisnici.bind(fetchUpravitelj));
}

function pripremiPutanjeKorisnik(){
  server.get('/baza/korisnici', restKorisnik.getKorisnici);
  server.post('/baza/korisnici', restKorisnik.postKorisnici);
  server.delete('/baza/korisnici', restKorisnik.deleteKorisnici);
  server.put('/baza/korisnici', restKorisnik.putKorisnici);
  server.get('/baza/korisnici/:korime', restKorisnik.getKorisnik);
  server.post('/baza/korisnici/:korime', restKorisnik.postKorisnik);
  server.delete('/baza/korisnici/:korime', restKorisnik.deleteKorisnik);
  server.put('/baza/korisnici/:korime', restKorisnik.putKorisnik);
  server.post('/baza/korisnici/:korime/prijava', restKorisnik.getKorisnikPrijava);

  server.get('/baza/nisuKontakti/:korime', restKorisnik.getNisuKontakti);
  server.post('/baza/blokiraj', restKorisnik.blokirajKorisnika);
  server.delete('/baza/odblokiraj', restKorisnik.odblokirajKorisnika);
  server.get('/baza/korisnici/:korime/blokirani', restKorisnik.dajBlokirane);
}

function pripremiPutanjeKontakt(){
  server.get('/baza/kontakti/:korime', restKontakt.getKontakti);
  server.post('/baza/kontakti/:korime', restKontakt.postKontakti);
}

function pripremiPutanjePorukeIDatoteke(){
  server.get('/baza/poruke/:posiljatelj/:primatelj', restPoruka.dajPoruke);
  server.post('/baza/poruke', restPoruka.posaljiPoruku);
  server.get('/baza/poruke', restPoruka.dajSvePoruke);

  server.get('/baza/datoteke/:posiljatelj/:primatelj', restDatoteka.dajDatoteke);
  server.post('/baza/datoteke', restDatoteka.posaljiDatoteku);
  server.get('/baza/datoteke', restDatoteka.getDatoteke);


  server.get('/baza/zaprimljene/:korime', restDatoteka.dajZaprimljeneDatoteke);

  server.get('/baza/statistika/:korime', restKorisnik.dajStatistike);
}

function pripremiPutanjeDnevnik() {
  server.get('/baza/dnevnik', restDnevnik.getDnevnik);
  server.get('/baza/dnevnik/:korime', restDnevnik.getDnevnikKorisnika);
  server.post('/baza/dnevnik', restDnevnik.postDnevnik);
  server.delete('/baza/dnevnik/:korime', restDnevnik.deleteDnevnikKorisnika);

  server.get('/baza/admin-statistika', restStatistika.getStatistika);
  server.get('/baza/poruke_vremensko_razdoblje', restDnevnik.getPorukeVremenskoRazdoblje);
  server.get('/baza/datoteke_vremensko_razdoblje', restDnevnik.getDatotekeVremenskoRazdoblje);
}

const httpServer = http.createServer(server);
const wss = new WebSocket.Server({ server: httpServer });

wss.on('connection', (ws, req) => {
  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    if (data.type === 'new_message' || data.type === 'new_file') {
      const rezultat = await obradiPoruku(data);
      if (!rezultat) return;

      const { korisnik, stvarniSadrzaj } = rezultat;
      
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: data.type,
            posiljatelj: data.posiljatelj,
            primatelj: data.primatelj,
            sadrzaj: stvarniSadrzaj,
            vrijemeSlanja: new Date()
          }));
        }
      });

      posaljiEmailObavijest(data.posiljatelj, stvarniSadrzaj, data.primatelj, korisnik);
    }
  });

  async function obradiPoruku(data) {
    const { posiljatelj, primatelj, sadrzaj, naziv, type } = data;
  
    let stvarniSadrzaj = sadrzaj;
    if (type === 'new_file') {
      stvarniSadrzaj = naziv;
    }
  
    const korisnikOdgovor = await fetch(`http://localhost:3000/baza/korisnici/${primatelj}`);
    if (korisnikOdgovor.status !== 200) {
      console.error('Korisnik nije pronađen!');
      return null;
    }
    const korisnik = await korisnikOdgovor.json();
  
    if (type === 'new_message') {
      const zahtjev = { body: { posiljatelj, primatelj, sadrzaj } };
      const odgovor = { type: () => {}, status: () => {}, send: () => {} };
      await restPoruka.posaljiPoruku(zahtjev, odgovor);
    }
  
    return { korisnik, stvarniSadrzaj };
  }
  
  function posaljiEmailObavijest(posiljatelj, sadrzaj, primatelj, korisnik) {
    if (korisnik.notif_email) {
      fetchUpravitelj.saljiMail({ body: { posiljatelj, sadrzaj, korime: primatelj } }, {
        status: () => {},
        json: () => {}
      });
    }
  }
  


  ws.on('close', () => {
    console.log('WebSocket klijent se odspojio');
  });
});

httpServer.listen(port, () => {
  console.log(`Server je pokrenut na http://localhost:${port}`);
});