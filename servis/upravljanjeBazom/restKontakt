const KontaktDAO = require("./kontaktDAO");

exports.getKontakti = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	if(!zahtjev.session.kontakt){
		odgovor.status(403);
		odgovor.send({ opis: "Zabranjen pristup!" });
	}else{
		let kdao = new KontaktDAO();
		kdao.dajSve().then((kontakti) => {
			console.log(kontakti);
			odgovor.status(200);
			odgovor.send(JSON.stringify(kontakti));
		});
	}
};

exports.postKontakti = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let podaci = zahtjev.body;
	console.log("POST podaci:");
	console.log(podaci);
	let kdao = new KontaktDAO();
	kdao.dodaj(podaci).then((poruka) => {
		odgovor.status(201);
		odgovor.send(JSON.stringify(poruka));
	});
};

exports.deleteKontakti = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(501);
	let poruka = { greska: "metoda nije implementirana" };
	odgovor.send(JSON.stringify(poruka));
};

exports.putKontakti = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(501);
	let poruka = { greska: "metoda nije implementirana" };
	odgovor.send(JSON.stringify(poruka));
};

exports.getKontakt = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let kdao = new KontaktDAO();
	let korime = zahtjev.params.korime;
	kdao.daj(korime).then((kontakt) => {
		console.log(kontakt);
		odgovor.status(200);
		odgovor.send(JSON.stringify(kontakt));
	});
};

exports.postKontakt = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	odgovor.status(405);
	let poruka = { greska: "Zabranjeno" };
	odgovor.send(JSON.stringify(poruka));
};

exports.deleteKontakt = function (zahtjev, odgovor) {
	odgovor.type("application/json");
	let kdao = new KontaktDAO();
    let korime = zahtjev.params.korime;
	let korisnik_id = zahtjev.params.korisnik_id;
		kdao.obrisi(korisnik_id, korime).then(() => {
		odgovor.status(201);
		odgovor.send({opis: "izvrseno"});
	});
};
