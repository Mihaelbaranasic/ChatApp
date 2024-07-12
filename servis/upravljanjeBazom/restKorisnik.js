const KorisnikDAO = require("./korisnikDAO.js");

exports.getKorisnici = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	if(!zahtjev.session.korisnik){
		odgovor.status(403);
		odgovor.send({ opis: "Zabranjen pristup!" });
	}else{
		let kdao = new KorisnikDAO();
		kdao.dajSve().then((korisnici) => {
			console.log(korisnici);
			odgovor.status(200);
			odgovor.send(JSON.stringify(korisnici));
		});
	}
};

exports.postKorisnici = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let podaci = zahtjev.body;
	console.log("POST podaci:");
	console.log(podaci);
	let kdao = new KorisnikDAO();
	kdao.dodaj(podaci).then((poruka) => {
		odgovor.status(200);
		odgovor.send(JSON.stringify(poruka));
	});
};

exports.deleteKorisnici = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(501);
	let poruka = { greska: "metoda nije implementirana" };
	odgovor.send(JSON.stringify(poruka));
};

exports.putKorisnici = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(501);
	let poruka = { greska: "metoda nije implementirana" };
	odgovor.send(JSON.stringify(poruka));
};

exports.getKorisnik = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let kdao = new KorisnikDAO();
	let korime = zahtjev.params.korime;
	kdao.daj(korime).then((korisnik) => {
		console.log(korisnik);
		odgovor.status(200);
		odgovor.send(JSON.stringify(korisnik));
	});
};

exports.getKorisnikPrijava = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let kdao = new KorisnikDAO();
	let korime = zahtjev.params.korime;
	kdao.daj(korime).then((korisnik) => {
		console.log(korisnik);
		console.log(zahtjev.body);
		if (korisnik != null && korisnik.lozinka == zahtjev.body.lozinka)
			odgovor.send(JSON.stringify(korisnik));
		else {
			odgovor.status(401);
			odgovor.send(JSON.stringify({ greska: "Krivi podaci!" }));
		}
	});
};
exports.postKorisnik = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(405);
	let poruka = { greska: "Zabranjeno" };
	odgovor.send(JSON.stringify(poruka));
};

exports.deleteKorisnik = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let kdao = new KorisnikDAO();
	let korime = zahtjev.params.korime;
	if(korime == "admin"){
		odgovor.status(403);
		odgovor.send({opis: "Zabranjeno je brisanje admina"});
	}else{
		kdao.obrisi(korime).then(() => {
		odgovor.status(200);
		odgovor.send({opis: "izvrseno"});
		});
	}
};

exports.putKorisnik = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let korime = zahtjev.params.korime;
	let podaci = zahtjev.body;
	let kdao = new KorisnikDAO();
	kdao.azuriraj(korime, podaci).then(() => {
	  odgovor.status(201);
	  odgovor.send({opis: "izvrseno"});
	}).catch((error) => {
		console.log({opis: "greska", detalji: error});
	  odgovor.status(500);
	  odgovor.send({opis: "greska", detalji: error});
	});
  };

exports.getNisuKontakti = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	if (!zahtjev.session.korisnik) {
        odgovor.status(403).json({ opis: "Zabranjen pristup!" });
    }
	let korime = zahtjev.params.korime;
	let kdao = new KorisnikDAO();
	kdao.dajSveKojiNisuKontakti(korime).then((korisnici) =>{
		odgovor.status(200);
		odgovor.send(JSON.stringify(korisnici));
	})
};

exports.blokirajKorisnika = async (zahtjev, odgovor) => {
    let { korime, blokiraniKorime } = zahtjev.body;
    try {
        let kdao = new KorisnikDAO();
        await kdao.blokirajKorisnika(korime, blokiraniKorime);
        odgovor.status(200).send({ opis: "Korisnik blokiran!" });
    } catch (error) {
        odgovor.status(500).send({ greska: "Greška pri blokiranju korisnika!" });
    }
};

exports.dajBlokirane = async (zahtjev, odgovor) => {
    let korime = zahtjev.params.korime;
    try {
        let kdao = new KorisnikDAO();
        let blokiraniKorisnici = await kdao.dajBlokirane(korime);
        odgovor.status(200).json(blokiraniKorisnici);
    } catch (error) {
        odgovor.status(500).json({ greska: "Greška pri dohvaćanju blokiranih korisnika!" });
    }
};

exports.odblokirajKorisnika = async (zahtjev, odgovor) => {
    let { korime, blokiraniKorime } = zahtjev.body;
    try {
        let kdao = new KorisnikDAO();
        await kdao.odblokirajKorisnika(korime, blokiraniKorime);
        odgovor.status(200).send({ opis: "Korisnik odblokiran!" });
    } catch (error) {
        odgovor.status(500).send({ greska: "Greška pri odblokiranju korisnika!" });
    }
};

exports.dajStatistike = async (zahtjev, odgovor) => {
    let korime = zahtjev.params.korime;
    try {
        let kdao = new KorisnikDAO();
        let statistike = await kdao.dajStatistike(korime);
        odgovor.status(200).json(statistike);
    } catch (error) {
        console.error("Greška pri dohvaćanju statistika:", error);
        odgovor.status(500).json({ greska: "Greška pri dohvaćanju statistika!" });
    }
};