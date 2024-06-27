let url = "http://localhost:3000";

window.addEventListener('load', async ()=>{
    ucitaj();
})

async function ucitaj(){
    ucitajKontakte();
    ucitajSveKorisnike();
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
    let korisnici = await odgovor.json();
    let popisKontakata = document.getElementById('listaKontakata');
    let html = ""
    for (let korisnik of korisnici) {
        html += "<li>" + korisnik.korime + "</li>";
    }
    popisKontakata.innerHTML = html;
}

async function ucitajSveKorisnike(){
    let korime = document.getElementById('korime').innerHTML;
    let parametri = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    };
    let odgovor = await fetch(`${url}/baza/nisuKontakti/${korime}`, parametri);
    let korisnici = await odgovor.json();
    let popisKorisnikaHTML = document.getElementById('sviKorisnici');
    let html = "";
    for (let korisnik of korisnici) {
        html += `<li onclick='dodajKontakt("${korisnik.id}", "${korime}")'>${korisnik.korime}</li>`;
        console.log(korisnik.id);
    }
    popisKorisnikaHTML.innerHTML = html;
}

async function dodajKontakt(korisnik, korime) {
    let parametri = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ korisnik })
    };
    let odgovor = await fetch(`${url}/baza/kontakti/${korime}`, parametri);
    let kontakt = await odgovor.json();
    console.log(odgovor.status);
    console.log(kontakt);
}