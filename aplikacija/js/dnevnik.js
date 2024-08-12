const url = 'http://localhost:3000';
let zapisi = [];

window.addEventListener('load', () => {
    prikaziZapise();
    document.getElementById('pretraga').addEventListener('input', filtrirajZapise);
    document.getElementById('tip-pretrage').addEventListener('change', filtrirajZapise);
});

async function prikaziZapise() {
    let prikaz = document.getElementsByClassName('container')[0];
    let odgovor = await fetch(url + '/baza/dnevnik', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    zapisi = await odgovor.json();
    prikaziFiltriraneZapise(zapisi);
}

function filtrirajZapise() {
    let tipPretrage = document.getElementById('tip-pretrage').value;
    let pretraga = document.getElementById('pretraga').value.toLowerCase();

    let filtriraniZapisi = zapisi.filter(zapis => {
        if (tipPretrage === 'korisnik') {
            return zapis.korisnicko_ime.toLowerCase().includes(pretraga);
        } else if (tipPretrage === 'aktivnost') {
            return zapis.aktivnost.toLowerCase().includes(pretraga);
        }
        return false;
    });

    prikaziFiltriraneZapise(filtriraniZapisi);
}

function prikaziFiltriraneZapise(zapisi) {
    let prikaz = document.getElementsByClassName('container')[0];
    let html = '';
    for (let zapis of zapisi) {
        html += '<div class="zapis">' + zapis.id + ' | ' + zapis.korisnicko_ime + ' | ' + zapis.aktivnost + ' | ' + zapis.vrijeme + '</div>';
    }
    prikaz.innerHTML = html;
}
