const Baza = require("./baza.js");

class KontaktDAO {

	constructor() {
		this.baza = new Baza("/home/NPK_01/mbaranasi21/ChatApp/servis/baza/ChatApp_baza.sqlite");
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

	obrisi = async function (korisnik_id, korime) {
		let sql = "DELETE FROM kontakt WHERE korisnik_id=? && korime=?";
    let podaci = [korisnik_id, korime];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}
	dajSveKojiNisuKontakti = async function (Korime) {
		this.baza.spojiSeNaBazu();
		let sql = `
		  SELECT * FROM korisnik 
		  WHERE uloge_id = 3
			AND korime != ?
			AND id NOT IN (SELECT kontakt_korisnik_id FROM kontakt WHERE korisnik_id = (SELECT id FROM korisnik WHERE korime = ?))
		`;
		let podaci = [Korime, Korime];
		this.baza.izvrsiUpit(sql, podaci);
		this.baza.zatvoriVezu();
		return podaci;
	  }
}

module.exports = KontaktDAO;
