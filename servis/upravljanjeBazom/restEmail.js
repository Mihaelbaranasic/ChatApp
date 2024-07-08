const nodemailer = require('nodemailer');
const KorisnikDAO = require('./korisnikDAO');
require('dotenv').config();

exports.sendEmailNotification = async function (zahtjev, odgovor) {
    let { posiljatelj, sadrzaj, korime } = zahtjev.body;

    let korisnikDAO = new KorisnikDAO();
    let korisnik = await korisnikDAO.daj(korime);

    if (!korisnik) {
        odgovor.status(404).json({ greska: "Korisnik nije pronađen!" });
        return;
    }

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: korisnik.email,
        subject: 'Nova poruka od ' + posiljatelj,
        text: sadrzaj
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
            odgovor.status(500).json({ greska: "Greška pri slanju email obavijesti!" });
        } else {
            console.log('Email poslan: ' + info.response);
            odgovor.status(200).json({ opis: "Email obavijest poslana!" });
        }
    });
};
