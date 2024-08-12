let url = "http://localhost:3000";

window.addEventListener('load', () => {
    provjeriUnos();
});

function provjeriUnos() {
    document.getElementById('prijava').addEventListener('submit', function(event) {
        event.preventDefault();

        let korime = document.getElementById('korime').value;
        let lozinka = document.getElementById('lozinka').value;
        let poruka = document.getElementById('poruka');
        let regex = /^[A-Za-z0-9]+$/;

        if (!regex.test(korime) || !regex.test(lozinka)) {
            poruka.innerText = "Dozvoljena su samo velika i mala slova te brojevi.";
        } else {
            poruka.innerText = "";
            posaljiFormu(korime, lozinka);
        }
    });
}

async function posaljiFormu(korime, lozinka) {
    try {
        let odgovor = await fetch(url + '/prijava', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ korime, lozinka })
        });

        if (odgovor.ok) {
            window.location.href = "/";
        } else {
            let data = await odgovor.json();
            document.getElementById('poruka').innerText = data.greska || "Došlo je do pogreške prilikom prijave.";
        }
    } catch (error) {
        document.getElementById('poruka').innerText = "Došlo je do pogreške prilikom prijave.";
    }
}