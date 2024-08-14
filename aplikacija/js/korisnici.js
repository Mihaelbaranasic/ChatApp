document.addEventListener("DOMContentLoaded", async () => {
    const korisniciLista = document.querySelector(".container");
    const traziKorisnika = document.getElementById("trazi-korisnika");

    const dohvatiKorisnike = async () => {
        try {
            const response = await fetch("/baza/korisnici");
            const korisnici = await response.json();
            return korisnici;
        } catch (error) {
            console.error("Greška pri dohvaćanju korisnika:", error);
        }
    };

    const prikaziKorisnike = (korisnici) => {
        korisniciLista.innerHTML = "";

        korisnici.forEach(korisnik => {
            switch(korisnik.uloge_id){
                case 1: korisnik.uloge_id = 'Administrator'; break;
                case 2: korisnik.uloge_id = 'Moderator'; break;
                case 3: korisnik.uloge_id = 'Korisnik'; break;
            }
            const korisnikDiv = document.createElement("div");
            korisnikDiv.className = "korisnik-container";
            korisnikDiv.innerHTML = `
                <div class="korisnik-info">
                    <strong>Korisničko ime:</strong> ${korisnik.korime}<br>
                    <strong>Puno ime:</strong> ${korisnik.punoIme}<br>
                    <strong>Email:</strong> ${korisnik.email}<br>
                    <strong>Uloga:</strong> ${korisnik.uloge_id}
                </div>
                <div class="korisnik-gumbovi">
                    <button onclick="obrisiKorisnika('${korisnik.korime}')">Briši</button>
                </div>
            `;
            korisniciLista.appendChild(korisnikDiv);
        });
    };

    window.obrisiKorisnika = async (korime) => {
        let potvrda = confirm("Jeste li sigurni da želite obrisati profil?");
        if (potvrda) {
            let parametri = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            };
            let odgovor = await fetch(`/baza/korisnici/${korime}`, parametri);
            if (odgovor.status == 200) {
                alert("Profil uspješno obrisan.");
                let zapis = await fetch(`/baza/dnevnik`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        aktivnost: 'Brisanje profila od strane administratora',
                        korisnik: korime
                        })
                    });
                prikaziKorisnike(await dohvatiKorisnike());
            } else if (odgovor.status == 403) {
                alert("Zabranjeno brisanje administratora!");
            } else {
                console.error("Greška pri brisanju profila!");
            }
        }
    };

    traziKorisnika.addEventListener("input", async () => {
        const filter = traziKorisnika.value.toLowerCase();
        const korisnici = await dohvatiKorisnike();
        const filtriraniKorisnici = korisnici.filter(korisnik =>
            korisnik.korime.toLowerCase().includes(filter)
        );
        prikaziKorisnike(filtriraniKorisnici);
    });

    prikaziKorisnike(await dohvatiKorisnike());
});
