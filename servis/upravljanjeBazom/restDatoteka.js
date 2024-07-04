const DatotekaDAO = require("./datotekaDAO");
const path = require('path');
const fs = require('fs');

exports.dajDatoteke = async function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let posiljatelj = zahtjev.params.posiljatelj;
    let primatelj = zahtjev.params.primatelj;
    let ddao = new DatotekaDAO();
    try {
        let datoteke = await ddao.dajDatoteke(posiljatelj, primatelj);
        odgovor.status(200).json(datoteke);
    } catch (error) {
        odgovor.status(500).json({ greska: "Greška pri dohvaćanju datoteka!" });
    }
};

exports.posaljiDatoteku = async function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let { posiljatelj, primatelj } = zahtjev.body;
    let datoteka = zahtjev.file;
    let ddao = new DatotekaDAO();
    try {
        let nazivDatoteke = datoteka.originalname;
        let putanjaDatoteke = path.join('/uploads', datoteka.filename);
        await ddao.posaljiDatoteku(posiljatelj, primatelj, nazivDatoteke, putanjaDatoteke);
        odgovor.status(201).json({ opis: "Datoteka poslana!" });
    } catch (error) {
        fs.unlinkSync(datoteka.path);
        odgovor.status(500).json({ greska: "Greška pri slanju datoteke!" });
    }
};
