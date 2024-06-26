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
		odgovor.status(201);
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
		odgovor.status(201);
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
	});
};
