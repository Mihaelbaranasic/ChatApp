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
            showNotification(data);
        }
        if (data.type === 'new_file') {
            if (data.posiljatelj === trenutniKontakt || data.primatelj === trenutniKontakt) {
                await ucitajPoruke();
            }
        }
    };
    ws.onclose = () => console.log('WebSocket veza zatvorena');
}

async function showNotification(data) {
    let korime = document.getElementById('korime').innerText;
    let odgovor = await fetch(`/baza/korisnici/${korime}`);
    if (odgovor.status == 200) {
        let korisnik = await odgovor.json();
        if (korisnik.notif_popup) {
            showPopupNotification(data.posiljatelj, data.sadrzaj);
        }
        if (korisnik.notif_dashboard) {
            updateDashboardNotification(data.posiljatelj, data.sadrzaj);
        }
        if (korisnik.notif_email) {
            sendEmailNotification(data.posiljatelj, data.sadrzaj);
        }
    } else {
        console.error('Greška pri dohvaćanju postavki obavijesti');
    }
}

function showPopupNotification(posiljatelj, sadrzaj) {
    let notification = new Notification("Nova poruka od " + posiljatelj, {
        body: sadrzaj,
    });
}

function updateDashboardNotification(posiljatelj, sadrzaj) {
    let dashboard = document.getElementById('dashboard-notifications');
    let notification = document.createElement('div');
    notification.className = 'dashboard-notification';
    notification.innerHTML = `<strong>${posiljatelj}</strong>: ${sadrzaj} <span class="close-btn" onclick="ukloniObavijest(this)">x</span>`;
    dashboard.appendChild(notification);
}

function ukloniObavijest(element) {
    element.parentElement.remove();
}

function sendEmailNotification(posiljatelj, sadrzaj) {
    let korime = document.getElementById('korime').innerHTML;
    let parametri = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ posiljatelj, sadrzaj, korime })
    };
    fetch('/baza/korisnici/emailObavijest', parametri)
    .then(response => {
        if (response.status == 200) {
            console.log('Email obavijest poslana');
        } else {
            console.error('Greška kod slanja email obavijesti');
        }
    });
}
