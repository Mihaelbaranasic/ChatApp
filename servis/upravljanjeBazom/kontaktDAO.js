const Baza = require("./baza.js");

class KontaktDAO {

	constructor() {
		this.baza = new Baza("/home/NPK_01/mbaranasi21/ChatApp/servis/baza/ChatApp_baza.sqlite");
	}

	dajSve = async function (korime) {
	this.baza.spojiSeNaBazu();
	let sql = "SELECT * FROM kontakt WHERE korime=?";
	var podaci = await this.baza.izvrsiUpit(sql, [korime]);
	this.baza.zatvoriVezu();
	return podaci;
	};

	daj = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM kontakt WHERE korime=?";
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

	dodaj = async function (id, korime) {
		let sql = `INSERT INTO kontakt (korime, korisnik_id) VALUES (?,?)`;
        let podaci = [korime, id];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}

	obrisi = async function (korisnik_id, korime) {
		let sql = "DELETE FROM kontakt WHERE korisnik_id=? && korime=?";
    let podaci = [korisnik_id, korime];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}
}

module.exports = KontaktDAO;
