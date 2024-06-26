const Baza = require("./baza.js");

class KorisnikDAO {

	constructor() {
		this.baza = new Baza("../../servis/baza/ChatApp_baza.sqlite");
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik";
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}

	daj = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korime=?;"
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

	dodaj = async function (korisnik) {
		console.log(korisnik)
		let sql = `INSERT INTO korisnik (punoIme,lozinka,email,korime,uloge_id,zadnjaPrijava) VALUES (?,?,?,?,?,?)`;
        let podaci = [korisnik.punoIme,korisnik.lozinka,korisnik.email,korisnik.korime,3, Date.now()];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}

	obrisi = async function (korime) {
		let sql = "DELETE FROM korisnik WHERE korime=?";
		await this.baza.izvrsiUpit(sql,[korime]);
		return true;
	}

	azuriraj = async function (korime, korisnik) {
		let sql = `UPDATE korisnik SET punoIme=?, email=?  WHERE korime=?`;
        let podaci = [korisnik.punoIme,
                      korisnik.email,korime];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}
}

module.exports = KorisnikDAO;
