const Baza = require("./baza.js");

class PorukaDAO {
    constructor() {
		this.baza = new Baza("./servis/baza/ChatApp_baza.sqlite");
    }

    async dajPoruke(posiljatelj, primatelj) {
        this.baza.spojiSeNaBazu();
        let sql = `SELECT p.*, k.korime
                   FROM poruka p
                   JOIN korisnik k ON p.korisnik_id = k.id
                   WHERE (korisnik_id = (SELECT id FROM korisnik WHERE korime = ?) AND kontakt_id = (SELECT id FROM korisnik WHERE korime = ?)) 
                      OR (korisnik_id = (SELECT id FROM korisnik WHERE korime = ?) AND kontakt_id = (SELECT id FROM korisnik WHERE korime = ?))
                   ORDER BY vrijemeSlanja`;
        let podaci = await this.baza.izvrsiUpit(sql, [posiljatelj, primatelj, primatelj, posiljatelj]);
        this.baza.zatvoriVezu();
        return podaci;
    }

    async posaljiPoruku(posiljatelj, primatelj, sadrzaj) {
        this.baza.spojiSeNaBazu();
        let sql = `INSERT INTO poruka (korisnik_id, kontakt_id, sadrzaj, vrijemeSlanja) 
                   VALUES ((SELECT id FROM korisnik WHERE korime = ?), (SELECT id FROM korisnik WHERE korime = ?), ?, datetime('now'))`;
        await this.baza.izvrsiUpit(sql, [posiljatelj, primatelj, sadrzaj]);
        this.baza.zatvoriVezu();
    }

    async oznaciPorukeKaoProcitane(posiljatelj, primatelj) {
        this.baza.spojiSeNaBazu();
        let sql = `UPDATE poruka
                   SET procitano = 1
                   WHERE kontakt_id = (SELECT id FROM korisnik WHERE korime = ?)
                     AND korisnik_id = (SELECT id FROM korisnik WHERE korime = ?)
                     AND procitano = 0`;
        await this.baza.izvrsiUpit(sql, [primatelj, posiljatelj]);
        this.baza.zatvoriVezu();
    }
}

module.exports = PorukaDAO;
