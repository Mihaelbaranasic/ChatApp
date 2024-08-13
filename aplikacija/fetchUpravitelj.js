const Autentifikacija = require("./autentifikacija.js");
const ds = require("fs/promises");
const mail = require("./moduli/email.js");

class FetchUpravitelj {
	constructor(port) {
		this.port = port;
		this.auth = new Autentifikacija(this.port);
	}

	registracija = async function (zahtjev, odgovor) {
		console.log(zahtjev.body);
		let greska = "";
		if (zahtjev.method == "POST") {
			let uspjeh = await this.auth.dodajKorisnika(zahtjev.body);
			if (uspjeh) {
				await fetch(`http://localhost:${this.port}/baza/dnevnik`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    aktivnost: 'Registracija',
                    korisnik: zahtjev.body.korime
                })
            });
				odgovor.redirect("/prijava");
				return;
			} else {
				greska = "Dodavanje nije uspjelo provjerite podatke!";
			}
		}

		let stranica = await ucitajStranicu("registracija", greska);
		odgovor.send(stranica);
	};

	odjava = async function (zahtjev, odgovor) {
		let korisnik = zahtjev.session.korisnik;
		zahtjev.session.korisnik = null;
	
		if (korisnik) {
			await fetch(`http://localhost:${this.port}/baza/dnevnik`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					aktivnost: 'Odjava',
					korisnik: korisnik.korime
				})
			});
		}
	
		odgovor.redirect("/");
	};

	prijava = async function (zahtjev, odgovor) {
		let greska = "";
		if (zahtjev.method == "POST") {
			var korime = zahtjev.body.korime;
			var lozinka = zahtjev.body.lozinka;
			var korisnik = await this.auth.prijaviKorisnika(korime, lozinka);
			console.log("ispisi zahtjev", zahtjev.body);

			if (korisnik) {
				console.log(korisnik);
				korisnik = JSON.parse(korisnik);
				console.log(korisnik);
				zahtjev.session.korisnik = korisnik;
				let zapis = await fetch(`http://localhost:${this.port}/baza/dnevnik`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    aktivnost: 'Prijava',
                    korisnik: korime
                	})
            	});
				odgovor.redirect("/");
				return;
			} else {
				odgovor.status(400);
				greska = "Netocni podaci!";
			}
		}

		let stranica = await ucitajStranicu("prijava", greska);
		odgovor.send(stranica);
	};

	dnevnik = async (zahtjev, odgovor) => {
		let korisnik = zahtjev.session.korisnik;
		if (!korisnik) {
			odgovor.redirect('/prijava');
			return;
		}
		
		if(korisnik.uloge_id != 1){
			odgovor.redirect('/glavna');
			return;
		}
	
		let stranica = await ucitajStranicu("dnevnik", '', korisnik);
		stranica = stranica.replace("#korime#", korisnik.korime);
		odgovor.send(stranica);
	};
	
	glavnaModerator = async (zahtjev, odgovor) => {
		let korisnik = zahtjev.session.korisnik;
		if (!korisnik) {
			odgovor.redirect('/prijava');
			return;
		}
		
		if(korisnik.uloge_id == 3){
			odgovor.redirect('/');
			return;
		}
	
		let stranica = await ucitajStranicu("glavna-moderator", '', korisnik);
		stranica = stranica.replace("#korime#", korisnik.korime);
		odgovor.send(stranica);
	}

	glavna = async (zahtjev, odgovor) => {
		let korisnik = zahtjev.session.korisnik;
		if (!korisnik) {
			odgovor.redirect('/prijava');
			return;
		}
		
		if(korisnik.uloge_id === 1){
			odgovor.redirect('/dnevnik');
			return;
		}

		if(korisnik.uloge_id === 2){
			odgovor.redirect('/glavna-moderator');
			return;
		}
	
		let stranica = await ucitajStranicu("glavna");
		stranica = stranica.replace("#korime#", korisnik.korime);
		odgovor.send(stranica);
	};
	  
	profil = async (zahtjev, odgovor) =>{
		let korisnik = zahtjev.session.korisnik;
		if (!korisnik) {
		  odgovor.redirect('/prijava');
		  return;
		}
		let stranica = await ucitajStranicu("profil");
		stranica = stranica.replace("#korime#", korisnik.korime);
		odgovor.send(stranica);
	};

	saljiMail = async (zahtjev, odgovor) => {
		let { posiljatelj, sadrzaj, korime } = zahtjev.body;
        try {
            await mail.posaljiMail(posiljatelj, korime, "Nova poruka", sadrzaj);
            odgovor.status(200);
        } catch (error) {
            console.error('Greška pri slanju email obavijesti:', error);
            odgovor.status(500);
        }
	}

	korisnici = async (zahtjev, odgovor) => {
		let korisnik = zahtjev.session.korisnik;
		if(!korisnik || korisnik.uloge_id != 1){
			odgovor.redirect('/');
			return;
		}
		let stranica = await ucitajStranicu('korisnici', '', korisnik);
		stranica = stranica.replace('#korime#', korisnik.korime);
		odgovor.send(stranica);
	}

	statistika = async function (zahtjev, odgovor) {
		let korisnik = zahtjev.session.korisnik;
		if (!korisnik) {
			odgovor.redirect('/prijava');
			return;
		}
	
		try {
			let statistikeOdgovor = await fetch(`http://localhost:${this.port}/baza/statistika/${korisnik.korime}`);
			if (statistikeOdgovor.status === 200) {
				let statistike = await statistikeOdgovor.json();
				let stranica = await ucitajStranicu("statistika");
				stranica = stranica.replace("#korime#", korisnik.korime);
				stranica = stranica.replace("#broj-razgovora#", statistike.brojRazgovora);
				stranica = stranica.replace("#korisnik-najvise-poruka#", statistike.najvisePoruka.korime);
				stranica = stranica.replace("#broj-poruka#", statistike.najvisePoruka.brojPoruka);
				odgovor.send(stranica);
			} else {
				console.error("Greška pri dohvaćanju statistika");
				odgovor.redirect('/prijava');
			}
		} catch (error) {
			console.error("Greška pri dohvaćanju statistika:", error);
			odgovor.redirect('/prijava');
		}
	};
	statistikaAdmin = async function (zahtjev, odgovor) {
		let korisnik = zahtjev.session.korisnik;
		if (!korisnik) {
			odgovor.redirect('/prijava');
			return;
		}
	
		if (korisnik.uloge_id !== 1) {
			odgovor.redirect('/glavna');
			return;
		}
	
		try {
			let adminStatistikeOdgovor = await fetch(`http://localhost:${this.port}/baza/admin-statistika`);
			
			if (adminStatistikeOdgovor.status === 200) {
				let adminStatistike = await adminStatistikeOdgovor.json();
				let stranica = await ucitajStranicu("statistika-admin","", korisnik);
				stranica = stranica.replace("#broj-korisnika#", adminStatistike.brojKorisnika);
				stranica = stranica.replace("#broj-poruka#", adminStatistike.brojPoruka);
				stranica = stranica.replace("#broj-datoteka#", adminStatistike.brojDatoteka);
				odgovor.send(stranica);
			} else {
				console.error("Greška pri dohvaćanju admin statistika");
				odgovor.redirect('/odjava');
			}
		} catch (error) {
			console.error("Greška pri dohvaćanju admin statistika:", error);
			odgovor.redirect('/odjava');
		}
	};
	
}
module.exports = FetchUpravitelj;


async function ucitajStranicu(nazivStranice, poruka = "", korisnik = null) {
    let stranice = [ucitajHTML(nazivStranice)];
    if (korisnik && korisnik.uloge_id === 1) {
        stranice.push(ucitajHTML("navigacija-admin"));
    } else if(korisnik && korisnik.uloge_id === 2){
		stranice.push(ucitajHTML("navigacija-moderator"));
	}
	else {
        stranice.push(ucitajHTML("navigacija"));
    }
    let [stranica, nav] = await Promise.all(stranice);
    stranica = stranica.replace("#navigacija#", nav);
    stranica = stranica.replace("#poruka#", poruka);
    return stranica;
}

function ucitajHTML(htmlStranica) {
	return ds.readFile(__dirname + "/html/" + htmlStranica + ".html", "UTF-8");
}
