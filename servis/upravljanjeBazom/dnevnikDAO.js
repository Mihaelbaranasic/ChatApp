const Baza = require("./baza.js");

const formatirajDatumZaSQLite = (datum) => {
    const date = new Date(datum);
    const godina = date.getFullYear();
    const mjesec = String(date.getMonth() + 1).padStart(2, '0');
    const dan = String(date.getDate()).padStart(2, '0');
    const sati = String(date.getHours()).padStart(2, '0');
    const minuti = String(date.getMinutes()).padStart(2, '0');
    const sekunde = String(date.getSeconds()).padStart(2, '0');
    return `${godina}-${mjesec}-${dan} ${sati}:${minuti}:${sekunde}`;
}

class DnevnikDAO {

	constructor() {
		this.baza = new Baza("./servis/baza/ChatApp_baza.sqlite");
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = `
			SELECT d.*, k.korime AS korisnicko_ime
			FROM dnevnik d
		 JOIN korisnik k ON d.korisnik_id = k.id
		 ORDER BY d.id DESC`;
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
        let trenutniDatum = formatirajDatumZaSQLite(new Date());
        let podaci = [aktivnost, trenutniDatum, korisnik]
        await this.baza.izvrsiUpit(sql, podaci);
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
	dajPorukePoDatumima = async function () {
		this.baza.spojiSeNaBazu();
		let sql = `
		SELECT 
			strftime('%Y-%m-%d', vrijeme) AS datum, 
			COUNT(*) AS broj_poruka
		FROM 
			dnevnik
		WHERE 
			aktivnost LIKE '%poruka%'
			AND datum >= date('now', '-10 days')  -- Ograničenje na posljednjih 10 dana
		GROUP BY 
			datum
		ORDER BY 
			datum ASC;
		`;
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}
	
	dajDatotekePoDatumima = async function () {
		this.baza.spojiSeNaBazu();
		let sql = `
		SELECT 
			strftime('%Y-%m-%d', vrijeme) AS datum, 
			COUNT(*) AS broj_datoteka
		FROM 
			dnevnik
		WHERE 
			aktivnost LIKE '%datoteka%'
			AND datum >= date('now', '-10 days')  -- Ograničenje na posljednjih 10 dana
		GROUP BY 
			datum
		ORDER BY 
			datum ASC;
		`;
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}
}

module.exports = DnevnikDAO;