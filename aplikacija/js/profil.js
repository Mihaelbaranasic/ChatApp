let url = "http://localhost:3000";
let datoteke = [];

window.addEventListener('load', async () => {
    await ucitajPostavkeObavijesti();
    PromjenaObavijesti();
    await prikaziBlokiraneKorisnike();
    await ucitajDatoteke();
    document.getElementById('delete-profile').addEventListener('click', obrisiProfil);
    document.getElementById('pretraga-datoteka').addEventListener('input', filtrirajDatoteke);
    document.getElementById('sortiraj-datoteke').addEventListener('change', sortirajDatoteke);
});

async function ucitajPostavkeObavijesti() {
    let korime = document.getElementById('korime').innerText;
    let odgovor = await fetch(`/baza/korisnici/${korime}`);
    if (odgovor.status == 200) {
        let korisnik = await odgovor.json();
        document.getElementById('notif-dashboard').checked = korisnik.notif_dashboard;
        document.getElementById('notif-popup').checked = korisnik.notif_popup;
        document.getElementById('notif-email').checked = korisnik.notif_email;
        document.getElementById('punoIme').value = korisnik.punoIme;
        document.getElementById('email').value = korisnik.email;
    } else {
        console.error('Greška pri dohvaćanju postavki obavijesti');
    }
}

function PromjenaObavijesti() {
    document.getElementById('save-notifications').addEventListener('click', async (event) => {
        event.preventDefault();

        let punoIme = document.getElementById('punoIme').value;
        let email = document.getElementById('email').value; 
        let poruka = document.getElementById('poruka');
        poruka.id = 'poruka';
        document.body.appendChild(poruka);

        let regexIme = /^[A-Za-zčćžšđČĆŽŠĐ\s]+$/;
        let regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!regexIme.test(punoIme)) {
            poruka.innerText = "Puno ime smije sadržavati samo slova i razmak.";
            return;
        } else if (!regexEmail.test(email)) {
            poruka.innerText = "Email nije ispravan.";
            return;
        } else {
            poruka.innerText = "";
        }

        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Dopuštenje za obavijesti odobreno');
                }
            });
        }
        
        let korime = document.getElementById('korime').innerText;
        let notif_dashboard = document.getElementById('notif-dashboard').checked ? 1 : 0;
        let notif_popup = document.getElementById('notif-popup').checked ? 1 : 0;
        let notif_email = document.getElementById('notif-email').checked ? 1 : 0;
    
        let parametri = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ punoIme, email, notif_dashboard, notif_popup, notif_email })
        };
        
        let odgovor = await fetch(`/baza/korisnici/${korime}`, parametri);
        console.log(odgovor.status);
        if (odgovor.status == 201) {
            alert('Postavke spremljene!');
        } else {
            console.error('Greška pri spremanju postavki!');
        }
    });
}

async function obrisiProfil() {
    let korime = document.getElementById('korime').innerText;
    let potvrda = confirm("Jeste li sigurni da želite obrisati profil?");
    if (potvrda) {
        let parametri = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        };
        let odgovor = await fetch(`/baza/korisnici/${korime}`, parametri);
        if (odgovor.status == 200) {
            alert("Profil uspješno obrisan.");
            window.location.href = "/odjava";
        } else {
            console.error("Greška pri brisanju profila!");
        }
    }
}

async function prikaziBlokiraneKorisnike() {
    let korime = document.getElementById('korime').innerText;
    let odgovor = await fetch(`/baza/korisnici/${korime}/blokirani`);
    if (odgovor.status == 200) {
        let blokiraniKorisnici = await odgovor.json();
        let listaBlokiranih = document.getElementById('blokiraniKorisnici');
        listaBlokiranih.innerHTML = '';
        for (let korisnik of blokiraniKorisnici) {
            let li = document.createElement('li');
            li.innerText = korisnik.korime;
            let button = document.createElement('button');
            button.innerText = 'Odblokiraj';
            button.addEventListener('click', () => odblokirajKorisnika(korisnik.korime));
            li.appendChild(button);
            listaBlokiranih.appendChild(li);
        }
    } else {
        console.error("Greška pri dohvaćanju blokiranih korisnika!");
    }
}

async function odblokirajKorisnika(blokiraniKorime) {
    let korime = document.getElementById('korime').innerText;
    let potvrda = confirm(`Jeste li sigurni da želite odblokirati korisnika ${blokiraniKorime}?`);
    if (potvrda) {
        let parametri = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({korime: korime, blokiraniKorime: blokiraniKorime})
        };
        fetch('/baza/odblokiraj', parametri)
        .then(response => {
            if (response.status == 200) {
                alert("Korisnik je uspješno odblokiran.");
                prikaziBlokiraneKorisnike();
            } else {
                console.error("Greška pri odblokiranju korisnika!");
            }
        });
    }
}

async function ucitajDatoteke() {
    let korime = document.getElementById('korime').innerHTML;
    let parametri = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    };
    let odgovor = await fetch(`${url}/baza/zaprimljene/${korime}`, parametri);
    datoteke = await odgovor.json();
    prikaziDatoteke(datoteke);
}

function prikaziDatoteke(datoteke) {
    let listaDatoteka = document.getElementById('lista-datoteka');
    let html = "";
    for (let datoteka of datoteke) {
        html += `<li>${datoteka.naziv} - ${datoteka.posiljatelj}</li>`;
    }
    listaDatoteka.innerHTML = html;
}

function filtrirajDatoteke() {
    let pretraga = document.getElementById('pretraga-datoteka').value.toLowerCase();
    let filtriraneDatoteke = datoteke.filter(datoteka => datoteka.naziv.toLowerCase().includes(pretraga) || datoteka.posiljatelj.toLowerCase().includes(pretraga));
    prikaziDatoteke(filtriraneDatoteke);
}

function sortirajDatoteke() {
    let kriterij = document.getElementById('sortiraj-datoteke').value;
    if (kriterij === "naziv") {
        datoteke.sort((a, b) => a.naziv.localeCompare(b.naziv));
    } else if (kriterij === "korisnik") {
        datoteke.sort((a, b) => a.posiljatelj.localeCompare(b.posiljatelj));
    }
    prikaziDatoteke(datoteke);
}
