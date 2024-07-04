const fs = require('fs');
const path = require('path');
const multer = require('multer');
const DatotekaDAO = require('./datotekaDAO');

const upload = multer({ dest: 'uploads/' });

exports.posaljiDatoteku = async (zahtjev, odgovor) => {
    try {
        upload.single('datoteka')(zahtjev, odgovor, async (err) => {
            if (err) {
                return odgovor.status(500).json({ greska: "Greška pri uploadu datoteke!" });
            }

            if (!zahtjev.file) {
                return odgovor.status(400).json({ greska: "Nijedna datoteka nije odabrana!" });
            }

            let { posiljatelj, primatelj } = zahtjev.body;
            let datoteka = zahtjev.file;

            let novaPutanja = path.join('uploads', datoteka.originalname);
            fs.renameSync(datoteka.path, novaPutanja);

            let ddao = new DatotekaDAO();
            await ddao.posaljiDatoteku(posiljatelj, primatelj, datoteka.originalname, novaPutanja);

            odgovor.status(201).json({ putanja: novaPutanja });
        });
    } catch (error) {
        odgovor.status(500).json({ greska: "Greška pri slanju datoteke!" });
    }
};

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
