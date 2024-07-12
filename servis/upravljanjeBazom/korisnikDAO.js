const Baza = require("./baza.js");

class KorisnikDAO {

	constructor() {
		this.baza = new Baza("./servis/baza/ChatApp_baza.sqlite");
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
		this.baza.spojiSeNaBazu();

		let sqlKontakti = `DELETE FROM kontakt WHERE korisnik_id = (SELECT id FROM korisnik WHERE korime = ?) OR korime = ?`;
		await this.baza.izvrsiUpit(sqlKontakti, [korime, korime]);

		let sqlKorisnik = `DELETE FROM korisnik WHERE korime = ?`;
		await this.baza.izvrsiUpit(sqlKorisnik, [korime]);

		this.baza.zatvoriVezu();
		return true;
	}

	azuriraj = async function (korime, korisnik) {
		console.log(korisnik);
		let sql = `UPDATE korisnik SET punoIme=?, email=?, notif_dashboard=?, notif_popup=?, notif_email=? WHERE korime=?`;
		let podaci = [korisnik.punoIme, korisnik.email, korisnik.notif_dashboard, korisnik.notif_popup, korisnik.notif_email, korime];
		await this.baza.izvrsiUpit(sql, podaci);
		return true;
	}
	dajSveKojiNisuKontakti = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = `SELECT * FROM korisnik WHERE uloge_id = 3 AND korime!=? AND id NOT IN (SELECT korisnik_id FROM kontakt WHERE korime = ?)`;
		let podaci = await this.baza.izvrsiUpit(sql, [korime, korime]);
		this.baza.zatvoriVezu();
		return podaci;
	  }
	  
	  blokirajKorisnika = async function (korime, blokiraniKorime) {
		this.baza.spojiSeNaBazu();
		let sql = `INSERT INTO blokiranKorisnik (korisnik_id, blokiran_korisnik_id) 
				   SELECT k1.id, k2.id 
				   FROM korisnik k1, korisnik k2 
				   WHERE k1.korime = ? AND k2.korime = ?`;
		await this.baza.izvrsiUpit(sql, [korime, blokiraniKorime]);
		this.baza.zatvoriVezu();
		return true;
	}
	
}

module.exports = KorisnikDAO;