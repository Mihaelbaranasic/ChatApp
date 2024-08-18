window.addEventListener('load', () => {
    provjeriUnos();
});

function provjeriUnos() {
    document.getElementById('registracija').addEventListener('submit', async function(event) {
        event.preventDefault();

        let punoIme = document.getElementById('punoIme').value;
        let email = document.getElementById('email').value;
        let korime = document.getElementById('korime').value;
        let lozinka = document.getElementById('lozinka').value;
        let poruka = document.getElementById('poruka');

        let regexIme = /^[A-Za-zČĆŠĐŽčćšđž\s]+$/;
        let regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        let regexKorimeLozinka = /^[A-Za-z0-9]+$/;

        if (!regexIme.test(punoIme)) {
            poruka.innerText = "Puno ime smije sadržavati samo slova i razmak.";
        } else if (!regexEmail.test(email)) {
            poruka.innerText = "Email nije ispravan.";
        } else if (!regexKorimeLozinka.test(korime)) {
            poruka.innerText = "Korisničko ime smije sadržavati samo slova i brojeve.";
        } else if (!regexKorimeLozinka.test(lozinka)) {
            poruka.innerText = "Lozinka smije sadržavati samo slova i brojeve.";
        } else {
            let korisnickoImePostoji = await provjeriKorisnickoIme(korime);
            if (!korisnickoImePostoji) {
                poruka.innerText = "Korisničko ime već postoji.";
            } else {
                poruka.innerText = "";
                posaljiFormu(punoIme, email, korime, lozinka);
            }
        }
    });
}

async function provjeriKorisnickoIme(korime) {
    let odgovor = await fetch(`/baza/korisnici/${korime}`);
    let rezultat = await odgovor.json();
    if (rezultat == null) {
        return true;
    } else {
        return false;
    }
    
}

async function posaljiFormu(punoIme, email, korime, lozinka) {
    try {
        let odgovor = await fetch('/registracija', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ punoIme, email, korime, lozinka })
        });

        if (odgovor.ok) {
            window.location.href = "/prijava";
        } else {
            let data = await odgovor.json();
            document.getElementById('poruka').innerText = data.greska || "Došlo je do pogreške prilikom registracije.";
        }
    } catch (error) {
        document.getElementById('poruka').innerText = "Došlo je do pogreške prilikom registracije.";
    }
}
