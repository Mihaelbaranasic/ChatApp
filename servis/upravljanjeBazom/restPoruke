const PorukaDAO = require("./porukaDAO");

exports.dajPoruke = async function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let posiljatelj = zahtjev.params.posiljatelj;
    let primatelj = zahtjev.params.primatelj;
    let pdao = new PorukaDAO();
    try {
        let poruke = await pdao.dajPoruke(posiljatelj, primatelj);
        await pdao.oznaciPorukeKaoProcitane(posiljatelj, primatelj);
        odgovor.status(200).json(poruke);
    } catch (error) {
        odgovor.status(500).json({ greska: "Greška pri dohvaćanju poruka!" });
    }
};

exports.posaljiPoruku = async function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let { posiljatelj, primatelj, sadrzaj } = zahtjev.body;
    let pdao = new PorukaDAO();
    try {
        await pdao.posaljiPoruku(posiljatelj, primatelj, sadrzaj);
        odgovor.status(201).json({ opis: "Poruka poslana!" });
    } catch (error) {
        odgovor.status(500).json({ greska: "Greška pri slanju poruke!" });
    }
};
