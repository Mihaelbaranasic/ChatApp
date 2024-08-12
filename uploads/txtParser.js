class TXTParser{
    obradi = function (ulaz, oznake) {
        if(ulaz == undefined || ulaz.trim() === "") return [];
        let rezultat = [];
        let sekcije = this.razdvojiUsekcije(ulaz);

        for (let sekcija of sekcije) {
            let objekt = this.procesirajSekciju(sekcija, oznake);
            rezultat.push(objekt);
        }

        return rezultat;
    }
    razdvojiUsekcije(ulaz) {
        let sekcije = [];
        let sekcija = "";
        let i = 0;

        while (i < ulaz.length) {
            if (ulaz[i] === '#' && (i === 0 || ulaz[i - 1] === '\n')) {
                sekcije.push(sekcija.trim());
                sekcija = "";
                i++;
            } else {
                sekcija += ulaz[i];
                i++;
            }
        }
        if (sekcija.trim() !== "") {
            sekcije.push(sekcija.trim());
        }

        return sekcije;
    }

    procesirajSekciju(sekcija, oznake){
        let linije = sekcija.split('\n');
        let objekt = {};

        for (let linija of linije) {
            let index = linija.indexOf(':');
            if (index !== -1) {
                let kljuc = linija.substring(0, index).trim();
                let vrijednost = linija.substring(index + 1).trim();
                if (oznake.includes(kljuc)) {
                    objekt[kljuc] = vrijednost;
                }
            }
        }

        return objekt;
    }
}

module.exports = TXTParser;