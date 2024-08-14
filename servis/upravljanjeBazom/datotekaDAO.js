const Baza = require("./baza.js");
const fs = require('fs');
const path = require('path');

function obrisiDatotekuSaDiska(putanjaDatoteke) {
    return new Promise((resolve, reject) => {
        fs.unlink(path.join(__dirname, '../../', putanjaDatoteke), (error) => {
            if (error) {
                console.error('Greška pri brisanju datoteke:', error);
                reject(new Error('Greška pri brisanju datoteke'));
            } else {
                resolve();
            }
        });
    });
}

class DatotekaDAO {
    constructor() {
		this.baza = new Baza("./servis/baza/ChatApp_baza.sqlite");
    }

    posaljiDatoteku = async function (naziv, putanja, posiljatelj, primatelj) {
        this.baza.spojiSeNaBazu();

        let korisnikSql = `SELECT id FROM korisnik WHERE korime = ?`;
        let posiljateljId = await this.baza.izvrsiUpit(korisnikSql, [posiljatelj]);
        let primateljId = await this.baza.izvrsiUpit(korisnikSql, [primatelj]);

        if (posiljateljId.length === 0 || primateljId.length === 0) {
            this.baza.zatvoriVezu();
            throw new Error("Korisnik ne postoji!");
        }

        let sql = `INSERT INTO datoteka (naziv, putanja, korisnik_id, kontakt_id) VALUES (?, ?, ?, ?)`;
        try {
            await this.baza.izvrsiUpit(sql, [naziv, putanja, posiljateljId[0].id, primateljId[0].id]);
            this.baza.zatvoriVezu();
        } catch (error) {
            this.baza.zatvoriVezu();
            throw error;
        }
    };

    async dajSve() {
        this.baza.spojiSeNaBazu();
        let sql = `SELECT * FROM datoteka`;
        let podaci = await this.baza.izvrsiUpit(sql, []);
        this.baza.zatvoriVezu();
        return podaci;
    }

    async obrisi(id) {
        this.baza.spojiSeNaBazu();
    
        let sqlGetPath = `SELECT putanja FROM datoteka WHERE id = ?`;
        let rezultat = await this.baza.izvrsiUpit(sqlGetPath, [id]);
    
        if (rezultat.length === 0) {
            this.baza.zatvoriVezu();
            throw new Error("Datoteka ne postoji!");
        }
    
        let putanjaDatoteke = rezultat[0].putanja;
    
        let sqlDelete = `DELETE FROM datoteka WHERE id = ?`;
        try {
            await this.baza.izvrsiUpit(sqlDelete, [id]);
            this.baza.zatvoriVezu();
            await obrisiDatotekuSaDiska(putanjaDatoteke);
        } catch (error) {
            this.baza.zatvoriVezu();
            throw error;
        }
    }

    async dajDatoteke(posiljatelj, primatelj) {
        this.baza.spojiSeNaBazu();
        let sql = `SELECT d.*, k.korime 
                   FROM datoteka d 
                   JOIN korisnik k ON d.korisnik_id = k.id 
                   WHERE (korisnik_id = (SELECT id FROM korisnik WHERE korime = ?) 
                          AND kontakt_id = (SELECT id FROM korisnik WHERE korime = ?)) 
                      OR (korisnik_id = (SELECT id FROM korisnik WHERE korime = ?) 
                          AND kontakt_id = (SELECT id FROM korisnik WHERE korime = ?))
                   ORDER BY vrijemePrimitka`;
        let podaci = await this.baza.izvrsiUpit(sql, [posiljatelj, primatelj, primatelj, posiljatelj]);
        this.baza.zatvoriVezu();
        return podaci;
    }

    async dajZaprimljeneDatoteke(korime) {
        this.baza.spojiSeNaBazu();
        let sql = `
            SELECT d.naziv, k.korime AS posiljatelj
            FROM datoteka d
            JOIN korisnik k ON d.korisnik_id = k.id
            WHERE d.kontakt_id = (SELECT id FROM korisnik WHERE korime = ?)
            AND d.korisnik_id NOT IN (
                SELECT blokiran_korisnik_id
                FROM blokiranKorisnik
                WHERE korisnik_id = (SELECT id FROM korisnik WHERE korime = ?)
            )
            AND d.korisnik_id NOT IN (
                SELECT korisnik_id
                FROM blokiranKorisnik
                WHERE blokiran_korisnik_id = (SELECT id FROM korisnik WHERE korime = ?)
            )
        `;
        let datoteke = await this.baza.izvrsiUpit(sql, [korime, korime, korime]);
        this.baza.zatvoriVezu();
        return datoteke;
    }

    async obrisiSveDatotekeZaRazgovor(posiljatelj, primatelj) {
        this.baza.spojiSeNaBazu();

        let sqlGetPaths = `SELECT putanja FROM datoteka 
                           WHERE (korisnik_id = (SELECT id FROM korisnik WHERE korime = ?) 
                                  AND kontakt_id = (SELECT id FROM korisnik WHERE korime = ?))
                              OR (korisnik_id = (SELECT id FROM korisnik WHERE korime = ?) 
                                  AND kontakt_id = (SELECT id FROM korisnik WHERE korime = ?))`;

        let putanjeDatoteka;
        try {
            putanjeDatoteka = await this.baza.izvrsiUpit(sqlGetPaths, [posiljatelj, primatelj, primatelj, posiljatelj]);
        } catch (error) {
            this.baza.zatvoriVezu();
            throw error;
        }

        let obrisanePutanje = [];
        for (const datoteka of putanjeDatoteka) {
            try {
                await obrisiDatotekuSaDiska(datoteka.putanja);
                obrisanePutanje.push(datoteka.putanja);
            } catch (error) {
                console.error(`Greška pri brisanju datoteke ${datoteka.putanja}:`, error);
            }
        }

        let sqlDelete = `DELETE FROM datoteka 
                         WHERE (korisnik_id = (SELECT id FROM korisnik WHERE korime = ?) 
                                AND kontakt_id = (SELECT id FROM korisnik WHERE korime = ?))
                            OR (korisnik_id = (SELECT id FROM korisnik WHERE korime = ?) 
                                AND kontakt_id = (SELECT id FROM korisnik WHERE korime = ?))`;

        try {
            await this.baza.izvrsiUpit(sqlDelete, [posiljatelj, primatelj, primatelj, posiljatelj]);
        } catch (error) {
            this.baza.zatvoriVezu();
            throw error;
        } finally {
            this.baza.zatvoriVezu();
        }
    }
}

module.exports = DatotekaDAO;
