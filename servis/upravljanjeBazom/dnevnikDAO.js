const Baza = require("./baza.js");

class DnevnikDAO {

	constructor() {
		this.baza = new Baza("./servis/baza/ChatApp_baza.sqlite");
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM dnevnik ORDER BY id DESC";
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}

	daj = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM dnevnik WHERE korisnik_id IN (SELECT id FROM korisnik WHERE korime = ?);"
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

	dodaj = async function (korisnik, aktivnost) {
		this.baza.spojiSeNaBazu();
		let sql = `INSERT INTO dnevnik (aktivnost, vrijeme, korisnik_id) VALUES (?, ?, (SELECT id FROM korisnik WHERE korime = ?));`;
		let trenutniDatum = new Date().toISOString();
        let podaci = [aktivnost, trenutniDatum, korisnik]
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
		return true;
	}

	obrisi = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql= `DELETE FROM dnevnik WHERE korisnik_id = (SELECT id FROM korisnik WHERE korime = ?)`;
		await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		return true;
	}
}

module.exports = DnevnikDAO;