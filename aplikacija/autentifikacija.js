const kodovi = require("./moduli/kodovi.js");
class Autentifikacija {
	constructor(port){
		this.port = port;
	}
	async dodajKorisnika(korisnik) {
		let tijelo = {
			punoIme: korisnik.punoIme,
			lozinka: kodovi.kreirajSHA256(korisnik.lozinka, korisnik.korime),
			email: korisnik.email,
			korime: korisnik.korime,
		};

		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			"http://localhost:" + this.port + "/baza/korisnici",
			parametri
		);

		if (odgovor.status == 200) {
			console.log("Korisnik ubačen na servisu");
			return true;
		} else {
			console.log(odgovor.status);
			console.log(await odgovor.text());
			return false;
		}
	}

	async prijaviKorisnika(korime, lozinka) {
		console.log("PRIJAVA: " + korime + lozinka);
		lozinka = kodovi.kreirajSHA256(lozinka, korime);
		console.log(lozinka);
		let tijelo = {
			lozinka: lozinka,
		};
		let zaglavlje = new Headers();
		zaglavlje.set("Content-Type", "application/json");

		let parametri = {
			method: "POST",
			body: JSON.stringify(tijelo),
			headers: zaglavlje,
		};
		let odgovor = await fetch(
			"http://localhost:" + this.port + "/baza/korisnici/" + korime + "/prijava",
			parametri
		);
		if (odgovor.status == 200) {
			return await odgovor.text();
		} else {
			return false;
		}
	}
}

module.exports = Autentifikacija;
