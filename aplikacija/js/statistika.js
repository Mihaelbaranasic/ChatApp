window.addEventListener('load', async () => {
    let korime = document.getElementById('korime').innerText;
    await ucitajStatistike(korime);
});

async function ucitajStatistike(korime) {
    try {
        let odgovor = await fetch(`/baza/statistika/${korime}`);
        if (odgovor.status === 200) {
            let statistike = await odgovor.json();
            document.getElementById('broj-razgovora').innerText = statistike.brojRazgovora;
            document.getElementById('broj-poruka').innerText = statistike.brojPoruka;
            document.getElementById('korisnik-najvise-poruka').innerText = statistike.najvisePoruka.korisnik;
            document.getElementById('broj-najvise-poruka').innerText = statistike.najvisePoruka.brojPoruka;
            document.getElementById('korisnik-najvise-datoteka').innerText = statistike.najviseDatoteka.korisnik;
            document.getElementById('broj-najvise-datoteka').innerText = statistike.najviseDatoteka.brojDatoteka;
        } else {
            console.error("Greška pri dohvaćanju statistika");
        }
    } catch (error) {
        console.error("Greška:", error);
    }
}
