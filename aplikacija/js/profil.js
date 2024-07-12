window.addEventListener('load', async () => {
    await ucitajPostavkeObavijesti();
    PromjenaObavijesti();
    await prikaziBlokiraneKorisnike();
    document.getElementById('delete-profile').addEventListener('click', obrisiProfil);
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
    document.getElementById('save-notifications').addEventListener('click', async () => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Dopuštenje za obavijesti odobreno');
                }
            });
        }
        
        let korime = document.getElementById('korime').innerText;
        let punoIme = document.getElementById('punoIme').value;
        let email = document.getElementById('email').value; 
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