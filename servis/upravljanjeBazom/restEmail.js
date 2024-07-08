const nodemailer = require('nodemailer');

exports.sendEmailNotification = async function (zahtjev, odgovor) {
    let { posiljatelj, sadrzaj, korime } = zahtjev.body;
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'mbaranasic100@gmail.com',
            pass: 'vatra100'
        }
    });

    let mailOptions = {
        from: 'mbaranasic100@gmail.com',
        to: 'recipient-email@gmail.com',
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
