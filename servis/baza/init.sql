

CREATE TABLE "uloga"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(50) NOT NULL,
  CONSTRAINT "naziv_UNIQUE"
    UNIQUE("naziv")
);
CREATE TABLE "korisnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "korime" VARCHAR(50) NOT NULL,
  "lozinka" VARCHAR(100) NOT NULL,
  "email" VARCHAR(45) NOT NULL,
  "punoIme" VARCHAR(100) NOT NULL,
  "zadnjaPrijava" TIMESTAMP,
  "uloge_id" INTEGER,
  CONSTRAINT "korime_UNIQUE"
    UNIQUE("korime"),
  CONSTRAINT "fk_korisnici_uloge1"
    FOREIGN KEY("uloge_id")
    REFERENCES "uloga"("id")
);
CREATE INDEX "korisnik.fk_korisnici_uloge1_idx" ON "korisnik" ("uloge_id");
CREATE TABLE "kontakt"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "korime" VARCHAR(45) NOT NULL,
  "korisnik_id" INTEGER NOT NULL,
  CONSTRAINT "fk_kontakt_korisnik1"
    FOREIGN KEY("korisnik_id")
    REFERENCES "korisnik"("id")
);
CREATE INDEX "kontakt.fk_kontakt_korisnik1_idx" ON "kontakt" ("korisnik_id");
CREATE TABLE "dnevnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "aktivnost" VARCHAR(45) NOT NULL,
  "vrijeme" DATETIME NOT NULL,
  "korisnik_id" INTEGER NOT NULL,
  CONSTRAINT "fk_dnevnik_korisnik1"
    FOREIGN KEY("korisnik_id")
    REFERENCES "korisnik"("id")
);
CREATE INDEX "dnevnik.fk_dnevnik_korisnik1_idx" ON "dnevnik" ("korisnik_id");
CREATE TABLE "poruka"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "sadrzaj" VARCHAR(200) NOT NULL,
  "vrijemeSlanja" TIMESTAMP NOT NULL,
  "procitano" INTEGER NOT NULL DEFAULT 0,
  "kontakt_id" INTEGER NOT NULL,
  "korisnik_id" INTEGER NOT NULL,
  "notif_dashboard" INTEGER DEFAULT 0,
  "notif-popup" INTEGER DEFAULT 0,
  "notif-email" INTEGER DEFAULT 0,
  CONSTRAINT "fk_poruka_kontakt1"
    FOREIGN KEY("kontakt_id")
    REFERENCES "kontakt"("id"),
  CONSTRAINT "fk_poruka_korisnik1"
    FOREIGN KEY("korisnik_id")
    REFERENCES "korisnik"("id")
);
CREATE INDEX "poruka.fk_poruka_kontakt1_idx" ON "poruka" ("kontakt_id");
CREATE INDEX "poruka.fk_poruka_korisnik1_idx" ON "poruka" ("korisnik_id");
CREATE TABLE "datoteka"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(100) NOT NULL,
  "putanja" VARCHAR(255) NOT NULL,
  "vrijemePrimitka" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "korisnik_id" INTEGER NOT NULL,
  "kontakt_id" INTEGER NOT NULL,
  CONSTRAINT "fk_datoteka_korisnik1"
    FOREIGN KEY("korisnik_id")
    REFERENCES "korisnik"("id"),
  CONSTRAINT "fk_datoteka_kontakt1"
    FOREIGN KEY("kontakt_id")
    REFERENCES "kontakt"("id")
);
CREATE INDEX "datoteka.fk_datoteka_korisnik1_idx" ON "datoteka" ("korisnik_id");
CREATE INDEX "datoteka.fk_datoteka_kontakt1_idx" ON "datoteka" ("kontakt_id");
CREATE TABLE "blokiranKorisnik"(
  "korisnik_id" INTEGER NOT NULL,
  "blokiran_korisnik_id" INTEGER NOT NULL,
  PRIMARY KEY("korisnik_id","blokiran_korisnik_id"),
  CONSTRAINT "fk_blokiranKorisnik_korisnik1"
    FOREIGN KEY("korisnik_id")
    REFERENCES "korisnik"("id"),
  CONSTRAINT "fk_blokiranKorisnik_korisnik2"
    FOREIGN KEY("blokiran_korisnik_id")
    REFERENCES "korisnik"("id")
);
CREATE INDEX "blokiranKorisnik.fk_blokiranKorisnik_korisnik1_idx" ON "blokiranKorisnik" ("korisnik_id");
CREATE INDEX "blokiranKorisnik.fk_blokiranKorisnik_korisnik2_idx" ON "blokiranKorisnik" ("blokiran_korisnik_id");

--INSERT INTO uloga (naziv) VALUES ('administrator'), ('moderator'), ('registriran korisnik');