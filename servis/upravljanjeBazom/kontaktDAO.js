const Baza = require("./baza.js");

class KorisnikDAO {

	constructor() {
		this.baza = new Baza("../../servis/baza/ChatApp_baza.sqlite");
	}

	daj = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM kontakt WHERE korime=?;"
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

	dodaj = async function (korisnik, korime) {
		console.log(korisnik)
		let sql = `INSERT INTO kontakt (korime, korisnik_id) VALUES (?,?,?,?,?,?)`;
        let podaci = [korime, korisnik.id];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}

	obrisi = async function (korime) {
		let sql = "DELETE FROM kontakt WHERE korime=?";
		await this.baza.izvrsiUpit(sql,[korime]);
		return true;
	}
}

module.exports = KorisnikDAO;
