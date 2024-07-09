const JEST = require("jest");
const XMLParser = require("./xmlParser.js");

describe('xmlParser', () => {
    let xmlParser;

    beforeEach(() => {
        xmlParser = new XMLParser();
    });

    test('metodaObradiSeMozePozvati', () => {
        let ulaz = 123;
        let oznake = ["ime", "grad"];
        expect(() => {
            xmlParser.obradi(ulaz, oznake);
        }).toThrowError('Ulaz mora biti string');
    });

    test('oznakeMorajuBitiNiz', () => {
        let ulaz = "<osobe></osobe>";
        let oznake = "ime";
        expect(() => {
            xmlParser.obradi(ulaz, oznake);
        }).toThrowError('Oznake moraju biti niz');
    });

    test('testPrihvatljivosti', () => {
        let ulaz = `
            <osobe>
                <osoba><ime>Ivan Horvat</ime><dob>30</dob><grad>Zagreb</grad></osoba>
                <osoba><ime>Ana Kovac</ime><dob>25</dob><grad>Split</grad></osoba>
                <osoba><ime>Marko Maric</ime><dob>35</dob><grad>Rijeka</grad></osoba>
            </osobe>`;
        let oznake = ["ime", "grad"];
        let ocekivaniIzlaz = [
            { ime: "Ivan Horvat", grad: "Zagreb" },
            { ime: "Ana Kovac", grad: "Split" },
            { ime: "Marko Maric", grad: "Rijeka" }
        ];
        let rezultat = xmlParser.obradi(ulaz, oznake);
        expect(rezultat).toEqual(ocekivaniIzlaz);
    }); 

    test('testPrazanString', () => {
        let ulaz = "";
        let oznake = ["ime", "grad"];
        let ocekivaniIzlaz = [];
        let rezultat = xmlParser.obradi(ulaz, oznake);
        expect(rezultat).toEqual(ocekivaniIzlaz);
    });

    test('testNevaljanXML', () => {
        let ulaz = "<osobe><osoba><ime>Ivan Horvat";
        let oznake = ["ime", "grad"];
        expect(() => {
            xmlParser.obradi(ulaz, oznake);
        }).toThrowError('Nevaljan XML');
    });

    test('testNedostatakTrazenihOznaka', () => {
        let ulaz = `
            <osobe>
                <osoba><ime>Ivan Horvat</ime><dob>30</dob><grad>Zagreb</grad></osoba>
            </osobe>`;
        let oznake = ["ime", "adresa"];
        let ocekivaniIzlaz = [
            { ime: "Ivan Horvat", adresa: null }
        ];
        let rezultat = xmlParser.obradi(ulaz, oznake);
        expect(rezultat).toEqual(ocekivaniIzlaz);
    });

    test('testVisestrukeIstovjetneOznake', () => {
        let ulaz = `
            <osobe>
                <osoba><ime>Ivan Horvat</ime><ime>Ivan H.</ime><grad>Zagreb</grad></osoba>
            </osobe>`;
        let oznake = ["ime", "grad"];
        let ocekivaniIzlaz = [
            { ime: "Ivan Horvat", grad: "Zagreb" }
        ];
        let rezultat = xmlParser.obradi(ulaz, oznake);
        expect(rezultat).toEqual(ocekivaniIzlaz);
    });

    test('testSamoJednaOsoba', () => {
        let ulaz = `
            <osobe>
                <osoba><ime>Ivan Horvat</ime><dob>30</dob><grad>Zagreb</grad></osoba>
            </osobe>`;
        let oznake = ["ime", "grad"];
        let ocekivaniIzlaz = [
            { ime: "Ivan Horvat", grad: "Zagreb" }
        ];
        let rezultat = xmlParser.obradi(ulaz, oznake);
        expect(rezultat).toEqual(ocekivaniIzlaz);
    });
});
