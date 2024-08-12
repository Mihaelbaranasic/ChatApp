const KorisnikDAO = require('./korisnikDAO');
const PorukaDAO = require('./porukaDAO');
const DatotekaDAO = require('./datotekaDAO');

const korisnikDAO = new KorisnikDAO();
const porukaDAO = new PorukaDAO();
const datotekaDAO = new DatotekaDAO();

exports.getStatistika = async (req, res) => {
    try {
        const korisnici = await korisnikDAO.dajSve();
        const brojKorisnika = korisnici.length;
        
        const poruke = await porukaDAO.dajSve();
        const brojPoruka = poruke.length;
        
        const datoteke = await datotekaDAO.dajSve();
        const brojDatoteka = datoteke.length;

        const stat = {
            brojKorisnika,
            brojPoruka,
            brojDatoteka
        };

        res.json(stat);
    } catch (error) {
        console.error('Greška pri dobavljanju statistike:', error);
        res.status(500).json({ error: 'Greška pri dobavljanju statistike' });
    }
};
