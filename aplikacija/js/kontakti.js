let url = "http://localhost:3000";

window.addEventListener('load', async ()=>{
    ucitaj();
})

async function ucitaj(){
    ucitajSveKorisnike();
}

async function ucitajSveKorisnike(){
    let korime = document.getElementById('korime').innerHTML;
    let parametri = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    };
    let odgovor = await fetch(`${url}/baza/nisuKontakti/${korime}`, parametri);
    console.log("odgovor: ", odgovor);
    let korisnici = await odgovor.json();
    let popisKorisnikaHTML = document.getElementById('sviKorisnici');
    console.log("html: ", popisKorisnikaHTML.innerHTML);
    console.log("korisnici: ", korisnici);
    let html = "";
    for (let korisnik of korisnici) {
        html += "<li>" + korisnik.korime + "</li>";
    }
    popisKorisnikaHTML.innerHTML = html;
}