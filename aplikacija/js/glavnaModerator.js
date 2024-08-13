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
    prikaziKontakte(kontakti, korime);
}

function prikaziKontakte(kontakti, korime) {
    document.getElementById('kontaktiModerator').style.display = 'block';
    let popisKontakata = document.getElementById('sviKontakti');
    let html = ""
    for (let korisnik of kontakti) {
        html += `<li onclick='otvoriRazgovor("${korisnik.kontakt_korime}", "${korime}")'>${korisnik.kontakt_korime}</li>`;
    }
    popisKontakata.innerHTML = html;
}

async function otvoriRazgovor(kontaktKorime, korisnikKorime) {
    document.getElementById('razgovor').style.display = 'block';
    await ucitajPoruke(kontaktKorime, korisnikKorime);
}

async function ucitajPoruke(kontaktKorime, korisnikKorime) {
    let parametri = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    };
    let odgovor = await fetch(`/baza/poruke/${korisnikKorime}/${kontaktKorime}`, parametri);
    let poruke = await odgovor.json();
    
    let datoteke = await fetch(`/baza/datoteke/${korisnikKorime}/${kontaktKorime}`, parametri);
    let datotekeData = await datoteke.json();
    console.log("Tu je korisnik: ", korisnikKorime);
    console.log("Tu je kontakt: ", kontaktKorime);
    prikaziPorukeIDatoteke(poruke, datotekeData);
    scrollajNaKraj();
}

function scrollajNaKraj() {
    let razgovorDiv = document.getElementById('razgovor');
    razgovorDiv.scrollTop = razgovorDiv.scrollHeight;
}

function prikaziPorukeIDatoteke(poruke, datoteke) {
    let popisPorukaHTML = document.getElementById('listaPoruka');
    let svePorukeIDatoteke = [...poruke, ...datoteke];

    svePorukeIDatoteke.sort((a, b) => new Date(a.vrijemeSlanja || a.vrijemePrimitka) - new Date(b.vrijemeSlanja || b.vrijemePrimitka));

    let html = "";
    for (let item of svePorukeIDatoteke) {
        if (item.sadrzaj) {
            let procitano = item.procitano ? "✓" : "";
            html += `<li><small>${item.korime}</small><small><br>${item.sadrzaj}<br><small>${item.vrijemeSlanja}</small> ${procitano}</li>`;
        } else if (item.naziv) {
            let fileExt = item.naziv.split('.').pop().toLowerCase();
            let fileHTML = "";
            if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
                fileHTML = `<img src="${item.putanja}" alt="${item.naziv}" style="max-width: 300px;"/>`;
            } else if (['mp3', 'wav', 'ogg'].includes(fileExt)) {
                fileHTML = `<audio controls><source src="${item.putanja}" type="audio/${fileExt}">Your browser does not support the audio element.</audio>`;
            } else if (['mp4', 'webm', 'ogg'].includes(fileExt)) {
                fileHTML = `<video controls style="max-width: 300px;"><source src="${item.putanja}" type="video/${fileExt}">Your browser does not support the video element.</video>`;
            } else {
                fileHTML = `<a href="${item.putanja}" target="_blank">${item.naziv}</a>`;
            }
            html += `<li><small>${item.korime}</small><br>${fileHTML}<br><small>${item.vrijemePrimitka}</small></li>`;
        }
    }
    popisPorukaHTML.innerHTML = html;
}