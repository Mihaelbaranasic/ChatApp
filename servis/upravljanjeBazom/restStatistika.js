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
        
        const poruke = await porukaDAO.dajPoruke();
        const brojPoruka = poruke.length;
        
        const datoteke = await datotekaDAO.dajDatoteke();
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

exports.getPorukeVremenskoRazdoblje = async (req, res) => {
    try {
        const sql = `SELECT strftime('%Y-%m', vrijemeSlanja) AS mjesec, COUNT(*) AS brojPoruka
                     FROM poruka
                     GROUP BY mjesec`;

        const poruke = await porukaDAO.baza.izvrsiUpit(sql, []);
        const labels = poruke.map(row => row.mjesec);
        const data = poruke.map(row => row.brojPoruka);

        res.json({ labels, data });
    } catch (error) {
        console.error('Greška pri dobavljanju poruka po vremenskom razdoblju:', error);
        res.status(500).json({ error: 'Greška pri dobavljanju poruka po vremenskom razdoblju' });
    }
};
