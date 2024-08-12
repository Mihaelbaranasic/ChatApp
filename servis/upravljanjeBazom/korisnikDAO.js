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
		let sql = `
			SELECT * 
			FROM korisnik 
			WHERE uloge_id = 3 
			AND korime != ? 
			AND id NOT IN (
				SELECT korisnik_id 
				FROM kontakt 
				WHERE korime = ? 
			)
			AND id NOT IN (
				SELECT blokiran_korisnik_id 
				FROM blokiranKorisnik 
				WHERE korisnik_id = (
					SELECT id 
					FROM korisnik 
					WHERE korime = ?
				)
			)
			AND id NOT IN (
				SELECT korisnik_id 
				FROM blokiranKorisnik 
				WHERE blokiran_korisnik_id = (
					SELECT id 
					FROM korisnik 
					WHERE korime = ?
				)
			)`;
		let podaci = await this.baza.izvrsiUpit(sql, [korime, korime, korime, korime]);
		this.baza.zatvoriVezu();
		return podaci;
	};
	  
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

	dajBlokirane = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = `
			SELECT k2.korime 
			FROM blokiranKorisnik bk 
			JOIN korisnik k1 ON k1.id = bk.korisnik_id 
			JOIN korisnik k2 ON k2.id = bk.blokiran_korisnik_id 
			WHERE k1.korime = ?`;
		let podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		return podaci;
	};

	odblokirajKorisnika = async function (korime, blokiraniKorime) {
		this.baza.spojiSeNaBazu();
		let sql = `DELETE FROM blokiranKorisnik 
				   WHERE korisnik_id = (SELECT id FROM korisnik WHERE korime = ?) 
				   AND blokiran_korisnik_id = (SELECT id FROM korisnik WHERE korime = ?)`;
		await this.baza.izvrsiUpit(sql, [korime, blokiraniKorime]);
		this.baza.zatvoriVezu();
		return true;
	}
	
	dajStatistike = async function (korime) {
		this.baza.spojiSeNaBazu();
	
		let sqlBrojRazgovora = `
			SELECT COUNT(*) AS brojRazgovora 
			FROM kontakt 
			WHERE korisnik_id = (SELECT id FROM korisnik WHERE korime = ?) 
			AND korisnik_id NOT IN (
				SELECT blokiran_korisnik_id 
				FROM blokiranKorisnik 
				WHERE korisnik_id = (SELECT id FROM korisnik WHERE korime = ?)
			)
			AND korisnik_id NOT IN (
				SELECT korisnik_id 
				FROM blokiranKorisnik 
				WHERE blokiran_korisnik_id = (SELECT id FROM korisnik WHERE korime = ?)
			)
		`;

		let sqlBrojPoruka = `
		SELECT COUNT(*) AS brojPoruka 
		FROM poruka 
		WHERE korisnik_id = (SELECT id FROM korisnik WHERE korime = ?) 
		OR kontakt_id = (SELECT id FROM korisnik WHERE korime = ?)
		`;

		let sqlNajvisePoruka = `
		SELECT
		k.korime AS korisnik, COUNT(*) AS brojPoruka FROM poruka p JOIN korisnik k
		ON (
			(p.korisnik_id = k.id AND p.kontakt_id = (SELECT id FROM kontakt WHERE korime = ?))
			OR (p.kontakt_id = k.id AND p.korisnik_id = (SELECT id FROM korisnik WHERE korime = ?))
		) WHERE k.korime != ? GROUP BY k.korime ORDER BY brojPoruka DESC LIMIT 1;
		`;

		let sqlBrojDatoteka = `
			SELECT COUNT(*) AS brojDatoteka 
			FROM datoteka 
			WHERE korisnik_id = (SELECT id FROM korisnik WHERE korime = ?)
			OR kontakt_id = (SELECT id FROM korisnik WHERE korime = ?)
		`;

		let sqlNajviseDatoteka = `
		SELECT
    k.korime AS korisnik, COUNT(*) AS brojDatoteka FROM datoteka d JOIN korisnik k
    ON (
        (d.korisnik_id = k.id AND d.kontakt_id IN (SELECT id FROM korisnik WHERE korime = ?))
        OR (d.kontakt_id = k.id AND d.korisnik_id IN (SELECT id FROM korisnik WHERE korime = ?))
    ) WHERE k.korime != ? GROUP BY k.korime ORDER BY brojDatoteka DESC LIMIT 1;
		`;
	
		let brojRazgovora = await this.baza.izvrsiUpit(sqlBrojRazgovora, [korime, korime, korime]);
		let brojPoruka = await this.baza.izvrsiUpit(sqlBrojPoruka, [korime, korime]);
		let najvisePoruka = await this.baza.izvrsiUpit(sqlNajvisePoruka, [korime, korime, korime]);
		let brojDatoteka = await this.baza.izvrsiUpit(sqlBrojDatoteka, [korime, korime]);
		let najviseDatoteka = await this.baza.izvrsiUpit(sqlNajviseDatoteka, [korime, korime, korime]);
	
		this.baza.zatvoriVezu();
	
		return {
			brojRazgovora: brojRazgovora[0]?.brojRazgovora || 0,
			brojPoruka: brojPoruka[0]?.brojPoruka || 0,
			najvisePoruka: najvisePoruka[0] || { korisnik: 'N/A', brojPoruka: 0 },
			brojDatoteka: brojDatoteka[0]?.brojDatoteka || 0,
			najviseDatoteka: najviseDatoteka[0] || { korisnik: 'N/A', brojDatoteka: 0 }
		};
	}
			
}

module.exports = KorisnikDAO;