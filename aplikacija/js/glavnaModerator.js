window.addEventListener('load', async () => {
    await ucitajSveKorisnike();
    // document.getElementById('pretraga-korisnici').addEventListener('input', pretraziKorisnike);
    // document.getElementById('pretraga-kontakti').addEventListener('input', pretraziKontakte);
});

async function ucitajSveKorisnike() {
    let parametri = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    };
    let odgovor = await fetch(`/baza/korisniciModerator`, parametri);
    sviKorisnici = await odgovor.json();
    prikaziSveKorisnike(sviKorisnici);
}

function prikaziSveKorisnike(korisnici) {
    let popisKorisnikaHTML = document.getElementById('sviKorisnici');
    let html = "";
    for (let korisnik of korisnici) {
        html += `<li onclick='ucitajKontakte("${korisnik.korime}")'>${korisnik.korime}</li>`;
    }
    popisKorisnikaHTML.innerHTML = html;
}

async function ucitajKontakte(korime) {
    let parametri = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    let odgovor = await fetch(`/baza/kontakti/${korime}`, parametri);
    kontakti = await odgovor.json();
    prikaziKontakte(kontakti);
}

function prikaziKontakte(kontakti) {
    document.getElementById('kontakti').style.display = 'block';
    let popisKontakata = document.getElementById('sviKontakti');
    let html = ""
    for (let korisnik of kontakti) {
        html += `<li onclick='otvoriRazgovor("${korisnik.kontakt_korime}")'>${korisnik.kontakt_korime}</li>`;
    }
    popisKontakata.innerHTML = html;
}