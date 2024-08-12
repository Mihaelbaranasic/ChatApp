const url = 'http://localhost:3000';

window.addEventListener('load', ()=>{
    prikaziZapise();
});

async function prikaziZapise(){
    let prikaz = document.getElementsByClassName('container')[0];
    let odgovor = await fetch(url + '/baza/dnevnik',{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    let zapisi = await odgovor.json();
    let html = '';
    for (let zapis of zapisi){
        html += '<div class="zapis">' + zapis.id + ' | ' + zapis.korisnik_id + ' | ' + zapis.aktivnost + ' | ' + zapis.vrijeme + '</div>'
    }
    prikaz.innerHTML = html;
}