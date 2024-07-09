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
		zahtjev.session.korisnik = null;
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
	glavna = async (zahtjev, odgovor) => {
		let korisnik = zahtjev.session.korisnik;
		if (!korisnik) {
		  odgovor.redirect('/prijava');
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
}
module.exports = FetchUpravitelj;


async function ucitajStranicu(nazivStranice, poruka = "") {
	let stranice = [ucitajHTML(nazivStranice), ucitajHTML("navigacija")];
	let [stranica, nav] = await Promise.all(stranice);
	stranica = stranica.replace("#navigacija#", nav);
	stranica = stranica.replace("#poruka#", poruka);
	return stranica;
}

function ucitajHTML(htmlStranica) {
	return ds.readFile(__dirname + "/html/" + htmlStranica + ".html", "UTF-8");
}
