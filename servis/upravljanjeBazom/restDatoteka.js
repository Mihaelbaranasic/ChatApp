const fs = require('fs');
const path = require('path');
const multer = require('multer');
const DatotekaDAO = require('./datotekaDAO');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname;
        const fileExt = path.extname(originalName);
        const baseName = path.basename(originalName, fileExt);
        const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        const posiljatelj = req.session.korisnik.korime;
        const newFilename = `${baseName}-${posiljatelj}-${timestamp.replace(/:/g, '-')}${fileExt}`;
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage });

exports.getDatoteke = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	if(!zahtjev.session.korisnik){
		odgovor.status(403);
		odgovor.send({ opis: "Zabranjen pristup!" });
	}else{
		let ddao = new DatotekaDAO();
		ddao.dajSve().then((datoteke) => {
			odgovor.status(200);
			odgovor.send(JSON.stringify(datoteke));
		});
	}
};

exports.obrisiDatoteku = function (zahtjev, odgovor) {
	odgovor.type("application/json");
    let id = zahtjev.params.id;
	if(!zahtjev.session.korisnik || zahtjev.session.korisnik.uloge_id != 2){
		odgovor.status(403);
		odgovor.send({ opis: "Zabranjen pristup!" });
	}else{
		let ddao = new DatotekaDAO();
		ddao.obrisi(id).then((datoteke) => {
			odgovor.status(200);
            odgovor.send(datoteke);
		});
	}
};

exports.posaljiDatoteku = [upload.single('datoteka'), async (req, res) => {
    let posiljatelj = req.body.posiljatelj;
    let primatelj = req.body.primatelj;
    let naziv = req.file.filename;
    let putanja = req.file.path;

    let ddao = new DatotekaDAO();
    try {
        await ddao.posaljiDatoteku(naziv, putanja, posiljatelj, primatelj);
        res.status(201).json({ message: 'Datoteka poslana' });
    } catch (error) {
        console.error('Greška pri slanju datoteke:', error);
        res.status(500).json({ error: 'Greška pri slanju datoteke' });
    }
}];

exports.dajDatoteke = async (zahtjev, odgovor) => {
    let { posiljatelj, primatelj } = zahtjev.params;
    let ddao = new DatotekaDAO();
    try {
        let datoteke = await ddao.dajDatoteke(posiljatelj, primatelj);
        odgovor.status(200).json(datoteke);
    } catch (error) {
        odgovor.status(500).json({ greska: "Greška pri dohvaćanju datoteka!" });
    }
};

exports.dajZaprimljeneDatoteke = async function (zahtjev, odgovor) {
    let korime = zahtjev.params.korime;
    let ddao = new DatotekaDAO();
    try {
        let datoteke = await ddao.dajZaprimljeneDatoteke(korime);
        odgovor.status(200).json(datoteke);
    } catch (error) {
        odgovor.status(500).json({ greska: "Greška pri dohvaćanju zaprimljenih datoteka!" });
    }
};

exports.obrisiSveDatotekeZaRazgovor = async function (zahtjev, odgovor) {
    odgovor.type("application/json");
    if(!zahtjev.session.korisnik || zahtjev.session.korisnik.uloge_id != 2){
        odgovor.status(403);
        odgovor.send({ opis: "Zabranjen pristup!" });
    }else{
        let { posiljatelj, primatelj } = zahtjev.params;
        let ddao = new DatotekaDAO();
        try {
            await ddao.obrisiSveDatotekeZaRazgovor(posiljatelj, primatelj);
            odgovor.status(200).json({ message: "Sve datoteke su uspješno obrisane." });
        } catch (error) {
            odgovor.status(500).json({ greska: "Greška pri brisanju datoteka!" });
        }
    }
};
