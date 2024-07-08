window.addEventListener('load', async () => {
    await ucitajPostavkeObavijesti();
    PromjenaObavijesti();
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
        if (odgovor.status == 201) {
            alert('Postavke spremljene!');
        } else {
            console.error('Greška pri spremanju postavki!');
        }
    });
}