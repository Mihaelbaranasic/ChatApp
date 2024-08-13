window.addEventListener('load', ()=>{
    document.getElementById('upitForma').addEventListener('submit', saljiFormu);
})

async function saljiFormu(event){
    event.preventDefault();

    let naslov = document.getElementById('naslov').value;
    let poruka = document.getElementById('poruka').value;
    let tipUpita = document.querySelector('input[name="tipUpita"]:checked').value;
    let korisnickoIme = document.getElementById('korisnickoIme').value;

    let sadrzaj = `Tip upita: ${tipUpita} \n\n Detalji: ${poruka}`;

    if(korisnickoIme != ''){
        sadrzaj += `\n\n Korisničko ime za brisanje: ${korisnickoIme}`;
    }

    let odgovor = fetch('/baza/saljiMail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ posiljatelj: 'moderator', sadrzaj, korime: 'admin', predmet: naslov})
    });
        document.getElementById('statusPoruka').innerText = "Upit je uspješno poslan.";
};

document.querySelectorAll('input[name="tipUpita"]').forEach((elem) => {
    elem.addEventListener('change', function(event) {
        let dodatneInformacije = document.getElementById('dodatneInformacije');
        if (event.target.value === 'brisanjeRacuna') {
            dodatneInformacije.style.display = 'block';
        } else {
            dodatneInformacije.style.display = 'none';
        }
    });
});