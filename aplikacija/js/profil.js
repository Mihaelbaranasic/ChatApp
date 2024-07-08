window.addEventListener('load', async () => {
    PromjenaObavijesti();
});

function PromjenaObavijesti(){
    document.getElementById('save-notifications').addEventListener('click', async () => {
        let korime = document.getElementById('korime').innerText;
        let dashboard = document.getElementById('notif-dashboard').checked ? 1 : 0;
        let popup = document.getElementById('notif-popup').checked ? 1 : 0;
        let email = document.getElementById('notif-email').checked ? 1 : 0;
    
        let parametri = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ korime, dashboard, popup, email })
        };
        let odgovor = await fetch('/baza/korisnici/obavjesti', parametri);
        if (odgovor.status == 200) {
            alert('Postavke spremljene!');
        } else {
            console.error('Greška pri spremanju postavki!');
        }
    });
    
}