const PorukaDAO = require("./porukaDAO");

exports.dajSvePoruke = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	if(!zahtjev.session.korisnik){
		odgovor.status(403);
		odgovor.send({ opis: "Zabranjen pristup!" });
	}else{
		let pdao = new PorukaDAO();
		pdao.dajSve().then((datoteke) => {
			odgovor.status(200);
			odgovor.send(JSON.stringify(datoteke));
		});
	}
};

exports.dajPoruke = async function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let posiljatelj = zahtjev.params.posiljatelj;
    let primatelj = zahtjev.params.primatelj;
    let pdao = new PorukaDAO();
    try {
        let poruke = await pdao.dajPoruke(posiljatelj, primatelj);
        await pdao.oznaciPorukeKaoProcitane(posiljatelj, primatelj);
        odgovor.status(200);
        odgovor.send(JSON.stringify(poruke));
    } catch (error) {
        odgovor.status(500);
        odgovor.send(JSON.stringify({ greska: "Greška pri dohvaćanju poruka!" }));
    }
};

exports.posaljiPoruku = async function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let { posiljatelj, primatelj, sadrzaj } = zahtjev.body;
    let pdao = new PorukaDAO();
    try {
        await pdao.posaljiPoruku(posiljatelj, primatelj, sadrzaj);
        odgovor.status(201);
        odgovor.send(JSON.stringify({ opis: "Poruka poslana!" }));
    } catch (error) {
        odgovor.status(500);
        odgovor.send(JSON.stringify({ greska: "Greška pri slanju poruke!" }))
    }
};


exports.obrisiPoruku = async function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let id = zahtjev.params.id;
    let pdao = new PorukaDAO();
    try {
        await pdao.obrisi(id);
        odgovor.status(201);
        odgovor.send(JSON.stringify({ opis: "Poruka poslana!" }));
    } catch (error) {
        odgovor.status(500);
        odgovor.send(JSON.stringify({ greska: "Greška pri slanju poruke!" }))
    }
};
