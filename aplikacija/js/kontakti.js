let url = "http://localhost:3000";
let sviKorisnici = [];
let kontakti = [];
let trenutniKontakt = null;
let ws;

window.addEventListener('load', async () => {
    await ucitaj();
    postaviWebSocket();
    document.getElementById('pretraga-korisnici').addEventListener('input', pretraziKorisnike);
    document.getElementById('posaljiPoruku').addEventListener('click', posaljiPoruku);
    document.getElementById('posaljiDatoteku').addEventListener('click', posaljiDatoteku);
});

async function ucitaj() {
    await ucitajKontakte();
    await ucitajSveKorisnike();
}

async function ucitajKontakte() {
    let korime = document.getElementById('korime').innerHTML;
    let parametri = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    let odgovor = await fetch(`${url}/baza/kontakti/${korime}`, parametri);
    kontakti = await odgovor.json();
    prikaziKontakte(kontakti);
}

async function ucitajSveKorisnike() {
    let korime = document.getElementById('korime').innerHTML;
    let parametri = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    };
    let odgovor = await fetch(`${url}/baza/nisuKontakti/${korime}`, parametri);
    sviKorisnici = await odgovor.json();
    prikaziSveKorisnike(sviKorisnici);
}

function prikaziKontakte(kontakti) {
    let popisKontakata = document.getElementById('listaKontakata');
    let html = ""
    for (let korisnik of kontakti) {
        html += `<li onclick='otvoriRazgovor("${korisnik.kontakt_korime}")'>${korisnik.kontakt_korime}</li>`;
    }
    popisKontakata.innerHTML = html;
    document.getElementById('broj-kontakata').innerText = kontakti.length;
}

function prikaziSveKorisnike(korisnici) {
    let popisKorisnikaHTML = document.getElementById('sviKorisnici');
    let korime = document.getElementById('korime').innerHTML;
    let html = "";
    for (let korisnik of korisnici) {
        html += `<li onclick='dodajKontakt("${korisnik.id}", "${korime}")'>${korisnik.korime}</li>`;
    }
    popisKorisnikaHTML.innerHTML = html;
}

async function dodajKontakt(korisnikId, korime) {
    let parametri = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ korisnik: korisnikId })
    };
    let odgovor = await fetch(`${url}/baza/kontakti/${korime}`, parametri);
    if (odgovor.status == 201) {
        await ucitaj();
    } else {
        console.error("Greška kod dodavanja kontakta!");
    }
}

function pretraziKorisnike() {
    let pretraga = document.getElementById('pretraga-korisnici').value.toLowerCase();
    let filtriraniKontakti = kontakti.filter(korisnik => korisnik.kontakt_korime.toLowerCase().includes(pretraga));
    let filtriraniKorisnici = sviKorisnici.filter(korisnik => korisnik.korime.toLowerCase().includes(pretraga));
    prikaziKontakte(filtriraniKontakti);
    prikaziSveKorisnike(filtriraniKorisnici);
}

async function otvoriRazgovor(kontaktKorime) {
    trenutniKontakt = kontaktKorime;
    document.getElementById('razgovor-korime').innerText = kontaktKorime;
    document.getElementById('razgovor').style.display = 'block';
    await ucitajPoruke();
}