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

async function ucitajPoruke() {
    let korime = document.getElementById('korime').innerHTML;
    let parametri = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    };
    let odgovor = await fetch(`${url}/baza/poruke/${korime}/${trenutniKontakt}`, parametri);
    let poruke = await odgovor.json();
    prikaziPoruke(poruke);
}

function prikaziPoruke(poruke) {
    let popisPorukaHTML = document.getElementById('listaPoruka');
    let html = "";
    for (let poruka of poruke) {
        let procitano = poruka.procitano ? "✓" : "";
        if (poruka.sadrzaj) {
            html += `<li><small>${poruka.korime}</small><br>${poruka.sadrzaj}<br><small>${poruka.vrijemeSlanja}</small> ${procitano}</li>`;
        } else if (poruka.datoteka) {
            html += `<li><small>${poruka.korime}</small><br><a href="/uploads/${poruka.datoteka}" download>${poruka.datoteka}</a><br><small>${poruka.vrijemeSlanja}</small> ${procitano}</li>`;
        }
    }
    popisPorukaHTML.innerHTML = html;
}

async function posaljiPoruku() {
    let korime = document.getElementById('korime').innerHTML;
    let sadrzaj = document.getElementById('novaPoruka').value;
    let parametri = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ posiljatelj: korime, primatelj: trenutniKontakt, sadrzaj })
    };
    let odgovor = await fetch(`${url}/baza/poruke`, parametri);
    if (odgovor.status == 201) {
        document.getElementById('novaPoruka').value = '';
        await ucitajPoruke();
        ws.send(JSON.stringify({ type: 'new_message', posiljatelj: korime, primatelj: trenutniKontakt, sadrzaj }));
    } else {
        console.error("Greška kod slanja poruke!");
    }
}

async function posaljiDatoteku() {
    let korime = document.getElementById('korime').innerHTML;
    let datotekaInput = document.getElementById('datotekaInput');
    let datoteka = datotekaInput.files[0];

    if (!datoteka) {
        console.error("Nijedna datoteka nije odabrana!");
        return;
    }

    let formData = new FormData();
    formData.append('datoteka', datoteka);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', `${url}/baza/datoteke`);
    xhr.onload = function () {
        if (xhr.status === 201) {
            ws.send(JSON.stringify({
                type: 'new_file',
                posiljatelj: korime,
                primatelj: trenutniKontakt,
                naziv: datoteka.name,
                putanja: xhr.responseText
            }));
            document.getElementById('datotekaInput').value = '';
        } else {
            console.error("Greška kod slanja datoteke!");
        }
    };
    xhr.send(formData);
}


function postaviWebSocket() {
    ws = new WebSocket('ws://localhost:3000');
    ws.onopen = () => console.log('WebSocket veza otvorena');
    ws.onmessage = (event) => {
        let data = JSON.parse(event.data);
        if (data.type === 'new_message') {
            if (data.posiljatelj === trenutniKontakt || data.primatelj === trenutniKontakt) {
                ucitajPoruke();
            }
        } else if (data.type === 'new_file') {
            if (data.posiljatelj === trenutniKontakt || data.primatelj === trenutniKontakt) {
                ucitajPoruke();
            }
        }
    };
    ws.onclose = () => console.log('WebSocket veza zatvorena');
}
