CREATE TABLE IF NOT EXISTS uloge (
    uloga_id SERIAL PRIMARY KEY,
    naziv_uloge VARCHAR(50) UNIQUE NOT NULL,
    opis_uloge TEXT
);

CREATE TABLE IF NOT EXISTS korisnici (
    korisnik_id SERIAL PRIMARY KEY,
    korisnicko_ime VARCHAR(50) UNIQUE NOT NULL,
    lozinka VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    puno_ime VARCHAR(100),
    zadnja_prijava TIMESTAMP,
    uloga VARCHAR(50) NOT NULL REFERENCES uloge(naziv_uloge)
);

CREATE TABLE IF NOT EXISTS kontakti (
    kontakt_id SERIAL PRIMARY KEY,
    korisnik_id INT REFERENCES korisnici(korisnik_id),
    kontakt_korisnik_id INT REFERENCES korisnici(korisnik_id)
);

CREATE TABLE IF NOT EXISTS poruke (
    poruka_id SERIAL PRIMARY KEY,
    posiljatelj_id INT REFERENCES korisnici(korisnik_id),
    primatelj_id INT REFERENCES korisnici(korisnik_id),
    sadrzaj TEXT NOT NULL,
    vrijeme_slanja TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    procitano BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS datoteke (
    datoteka_id SERIAL PRIMARY KEY,
    posiljatelj_id INT REFERENCES korisnici(korisnik_id),
    primatelj_id INT REFERENCES korisnici(korisnik_id),
    naziv_datoteke VARCHAR(255) NOT NULL,
    putanja_datoteke VARCHAR(255) NOT NULL,
    vrijeme_primanja TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dnevnik_aktivnosti (
    zapis_id SERIAL PRIMARY KEY,
    korisnik_id INT REFERENCES korisnici(korisnik_id),
    aktivnost VARCHAR(255) NOT NULL,
    vrijeme_zapisa TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blokirani_korisnici (
    blokiratelj_id INT REFERENCES korisnici(korisnik_id),
    blokirani_id INT REFERENCES korisnici(korisnik_id),
    PRIMARY KEY (blokiratelj_id, blokirani_id)
);

-- INSERT INTO uloge (naziv_uloge, opis_uloge) VALUES ('registrirani korisnik', 'Običan korisnik aplikacije'), ('moderator', 'Korisnik koji ima veće ovlasti od običnog korisnika'), ('admin', 'Administrator aplikacije');
-- INSERT INTO korisnici (korisnicko_ime, lozinka, email, puno_ime, zadnja_prijava, uloga)
-- VALUES ('admin', 'hashed_password', 'admin@example.com', 'Admin Ime', NOW(), 'administrator');
