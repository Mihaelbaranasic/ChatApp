const DnevnikDAO = require("./dnevnikDAO.js");

exports.getDnevnik = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let ddao = new DnevnikDAO();
    ddao.dajSve().then((zapisi) => {
        odgovor.status(200);
        odgovor.send(JSON.stringify(zapisi));
    }).catch((error) => {
        odgovor.status(500);
        odgovor.send(JSON.stringify({ greska: "Greška pri dohvaćanju zapisa iz dnevnika." }));
    });
};

exports.getDnevnikKorisnika = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let ddao = new DnevnikDAO();
    let korime = zahtjev.params.korime;
    ddao.daj(korime).then((zapis) => {
        if (zapis) {
            odgovor.status(200);
            odgovor.send(JSON.stringify(zapis));
        } else {
            odgovor.status(404);
            odgovor.send(JSON.stringify({ greska: "Zapis nije pronađen." }));
        }
    }).catch((error) => {
        odgovor.status(500);
        odgovor.send(JSON.stringify({ greska: "Greška pri dohvaćanju zapisa iz dnevnika." }));
    });
};

exports.postDnevnik = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let ddao = new DnevnikDAO();
    let { korisnik, aktivnost } = zahtjev.body;
    ddao.dodaj(korisnik, aktivnost).then(() => {
        odgovor.status(201);
        odgovor.send(JSON.stringify({ poruka: "Zapis dodan u dnevnik." }));
    }).catch((error) => {
        odgovor.status(500);
        odgovor.send(JSON.stringify({ greska: "Greška pri dodavanju zapisa u dnevnik." }));
    });
};

exports.deleteDnevnikKorisnika = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let ddao = new DnevnikDAO();
    let korime = zahtjev.params.korime;
    ddao.obrisi(korime).then(() => {
        odgovor.status(200);
        odgovor.send(JSON.stringify({ poruka: "Zapis izbrisan iz dnevnika." }));
    }).catch((error) => {
        odgovor.status(500);
        odgovor.send(JSON.stringify({ greska: "Greška pri brisanju zapisa iz dnevnika." }));
    });
};

exports.putDnevnik = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(405);
	let poruka = { greska: "Zabranjeno" };
	odgovor.send(JSON.stringify(poruka));
};

exports.getPorukeVremenskoRazdoblje = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let ddao = new DnevnikDAO();
    ddao.dajPorukePoDatumima().then((rezultat) => {
        odgovor.status(200);
        odgovor.send(JSON.stringify(rezultat));
    }).catch((error) => {
        odgovor.status(500);
        odgovor.send(JSON.stringify({ greska: "Greška pri dohvaćanju poruka po datumima." }));
    });
};

exports.getDatotekeVremenskoRazdoblje = function (zahtjev, odgovor) {
    odgovor.type("application/json");
    let ddao = new DnevnikDAO();
    ddao.dajDatotekePoDatumima().then((rezultat) => {
        odgovor.status(200);
        odgovor.send(JSON.stringify(rezultat));
    }).catch((error) => {
        odgovor.status(500);
        odgovor.send(JSON.stringify({ greska: "Greška pri dohvaćanju datoteka po datumima." }));
    });
};