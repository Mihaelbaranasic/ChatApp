const JEST = require("jest");
const TXTParser = require("./txtParser.js");

describe('txtParser', () => {
    let txtParser;

    beforeEach(() => {
        txtParser = new TXTParser();
    });

    test('metodaObradiSeMozePozvati', () => {
        txtParser.obradi();
    });

    test('prazanUlaz', () => {
        let ulaz = "";
        let oznake = ["ime", "grad"];
        let ocekivaniIzlaz = [];
        let rezultat = txtParser.obradi(ulaz, oznake);
        expect(rezultat).toEqual(ocekivaniIzlaz);
    });

    test('ulazBezSekcija', () => {
        let ulaz = "ime: Ivan Horvat\ndob: 30\ngrad: Zagreb";
        let oznake = ["ime", "grad"];
        let ocekivaniIzlaz = [{ ime: "Ivan Horvat", grad: "Zagreb" }];
        let rezultat = txtParser.obradi(ulaz, oznake);
        expect(rezultat).toEqual(ocekivaniIzlaz);
    });

    test('razliciteOznake', () => {
        let ulaz = "ime: Ivan Horvat\ndob: 30\ngrad: Zagreb\n#\nime: Ana Kovac\ndob: 25\ngrad: Split\n#\nime: Marko Maric\ndob: 35\ngrad: Rijeka";
        let oznake = ["dob"];
        let ocekivaniIzlaz = [
            { dob: "30" },
            { dob: "25" },
            { dob: "35" }
        ];
        let rezultat = txtParser.obradi(ulaz, oznake);
        expect(rezultat).toEqual(ocekivaniIzlaz);
    });

    test('nepotpuniPodaci', () => {
        let ulaz = "ime: Ivan Horvat\ndob: 30\ngrad: Zagreb\n#\nime: Ana Kovac\ndob:\ngrad: Split";
        let oznake = ["ime", "dob", "grad"];
        let ocekivaniIzlaz = [
            { ime: "Ivan Horvat", dob: "30", grad: "Zagreb" },
            { ime: "Ana Kovac", dob: "", grad: "Split" }
        ];
        let rezultat = txtParser.obradi(ulaz, oznake);
        expect(rezultat).toEqual(ocekivaniIzlaz);
    });

    test('dodatnePrazneLinije', () => {
        let ulaz = "ime: Ivan Horvat\n\ndob: 30\n\ngrad: Zagreb\n#\nime: Ana Kovac\n\ndob: 25\n\ngrad: Split\n#\nime: Marko Maric\n\ndob: 35\n\ngrad: Rijeka";
        let oznake = ["ime", "grad"];
        let ocekivaniIzlaz = [
            { ime: "Ivan Horvat", grad: "Zagreb" },
            { ime: "Ana Kovac", grad: "Split" },
            { ime: "Marko Maric", grad: "Rijeka" }
        ];
        let rezultat = txtParser.obradi(ulaz, oznake);
        expect(rezultat).toEqual(ocekivaniIzlaz);
    });

    test('testPrihvatljivosti', () => {
        let ulaz = "ime: Ivan Horvat\ndob: 30\ngrad: Zagreb\n#\nime: Ana Kovac\ndob: 25\ngrad: Split\n#\nime: Marko Maric\ndob: 35\ngrad: Rijeka";
        let oznake = ["ime", "grad"];
        let ocekivaniIzlaz = [
            { ime: "Ivan Horvat", grad: "Zagreb" },
            { ime: "Ana Kovac", grad: "Split" },
            { ime: "Marko Maric", grad: "Rijeka" }
        ];
        let rezultat = txtParser.obradi(ulaz, oznake);
        expect(rezultat).toEqual(ocekivaniIzlaz);
    });
});
