const Baza = require("./baza.js");

class KorisnikDAO {

	constructor() {
		this.baza = new Baza("/home/NPK_01/mbaranasi21/ChatApp/servis/baza/ChatApp_baza.sqlite");
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
		this.baza.spojiSeNaBazu();
		console.log(korisnik)
		let sql = `INSERT INTO korisnik (punoIme,lozinka,email,korime,uloge_id,zadnjaPrijava) VALUES (?,?,?,?,?,?)`;
		let trenutniDatum = new Date().toISOString();
        let podaci = [korisnik.punoIme,korisnik.lozinka,korisnik.email,korisnik.korime,3, trenutniDatum];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
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
	dajSveKojiNisuKontakti = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = `
		  SELECT * FROM korisnik 
		  WHERE uloge_id = 3
			AND korime != ?
			AND id NOT IN (SELECT kontakt_korisnik_id FROM kontakt WHERE korisnik_id = (SELECT id FROM korisnik WHERE korime = ?))
		`;
		let podaci = [korime, korime];
		this.baza.izvrsiUpit(sql, podaci);
		this.baza.zatvoriVezu();
		return podaci;
	  }
}

module.exports = KorisnikDAO;
