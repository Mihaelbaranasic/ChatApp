let url = "http://localhost:3000";
const nodemailer = require('nodemailer');
require('dotenv').config({path:__dirname+'/.env'});

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.posaljiMail = async (salje, prima, predmet, poruka) => {
    let parametri = {method : "GET"};
    let podaci = await fetch(`${url}/baza/korisnici/${prima}`, parametri);
    let korisnik = await podaci.json();
    if (!korisnik) {
        odgovor.status(404).json({ greska: "Korisnik nije pronađen!" });
        return;
    }
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: korisnik.email,
        subject: predmet + " od " + salje,
        text: poruka
    };
    try {
        let odgovor = await transporter.sendMail(mailOptions);
        return odgovor;
    } catch (error) {
        console.error("Greška prilikom slanja e-pošte:", error);
        throw error;
    }
};