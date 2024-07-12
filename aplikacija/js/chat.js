window.addEventListener('load', async () => {
    postaviWebSocket();
});

function postaviWebSocket() {
    ws = new WebSocket('ws://localhost:3000');
    ws.onopen = () => console.log('WebSocket veza otvorena');
    ws.onmessage = async (event) => {
        let data = JSON.parse(event.data);
        if (data.type === 'new_message') {
            if (data.posiljatelj === trenutniKontakt || data.primatelj === trenutniKontakt) {
                await ucitajPoruke();
            }
            prikaziObavijest(data);
        }
        if (data.type === 'new_file') {
            if (data.posiljatelj === trenutniKontakt || data.primatelj === trenutniKontakt) {
                await ucitajPoruke();
            }
        }
    };
    ws.onclose = () => console.log('WebSocket veza zatvorena');
}

async function prikaziObavijest(data) {
    let korime = document.getElementById('korime').innerText;
    let odgovor = await fetch(`/baza/korisnici/${korime}`);
    if (odgovor.status == 200) {
        let korisnik = await odgovor.json();
        if (korisnik.notif_popup) {
            prikaziPopup(data.posiljatelj, data.sadrzaj);
        }
        if (korisnik.notif_dashboard) {
            azurirajDashboard(data.posiljatelj, data.sadrzaj);
        }
    } else {
        console.error('Greška pri dohvaćanju postavki obavijesti');
    }
}

function prikaziPopup(posiljatelj, sadrzaj) {
    let obavijest = new Notification("Nova poruka od " + posiljatelj, {
        body: sadrzaj,
    });
}

function azurirajDashboard(posiljatelj, sadrzaj) {
    let dashboard = document.getElementById('dashboard-obavijest');
    let obavijest = document.createElement('div');
    obavijest.className = 'dashboard-obavijest';
    obavijest.innerHTML = `<strong>${posiljatelj}</strong>: ${sadrzaj} <span class="close-btn" onclick="ukloniObavijest(this)">x</span>`;
    dashboard.appendChild(obavijest);
}

function ukloniObavijest(element) {
    element.parentElement.remove();
}