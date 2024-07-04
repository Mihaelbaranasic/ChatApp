const Baza = require("./baza.js");

class DatotekaDAO {
    constructor() {
        this.baza = new Baza("/home/NPK_01/mbaranasi21/ChatApp/servis/baza/ChatApp_baza.sqlite");
    }

    async posaljiDatoteku(posiljatelj, primatelj, naziv, putanja) {
        this.baza.spojiSeNaBazu();
        let sql = `INSERT INTO datoteka (korisnik_id, kontakt_id, naziv, putanja, vrijemePrimitka) 
                   VALUES ((SELECT id FROM korisnik WHERE korime = ?), (SELECT id FROM korisnik WHERE korime = ?), ?, ?, datetime('now'))`;
        await this.baza.izvrsiUpit(sql, [posiljatelj, primatelj, naziv, putanja]);
        this.baza.zatvoriVezu();
    }

    async dajDatoteke(posiljatelj, primatelj) {
        this.baza.spojiSeNaBazu();
        let sql = `SELECT d.*, k.korime 
                   FROM datoteka d 
                   JOIN korisnik k ON d.korisnik_id = k.id 
                   WHERE (korisnik_id = (SELECT id FROM korisnik WHERE korime = ?) AND kontakt_id = (SELECT id FROM korisnik WHERE korime = ?)) 
                      OR (korisnik_id = (SELECT id FROM korisnik WHERE korime = ?) AND kontakt_id = (SELECT id FROM korisnik WHERE korime = ?))
                   ORDER BY vrijemePrimitka`;
        let podaci = await this.baza.izvrsiUpit(sql, [posiljatelj, primatelj, primatelj, posiljatelj]);
        this.baza.zatvoriVezu();
        return podaci;
    }
}

module.exports = DatotekaDAO;
