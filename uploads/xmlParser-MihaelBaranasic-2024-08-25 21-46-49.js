class XMLParser {
    obradi(ulaz, oznake) {
        this.provjeriUlaz(ulaz, oznake);

        const osobeElements = this.dohvatiElementePoTagu(ulaz, 'osoba');
        
        return osobeElements.map(osobaContent => this.izvuciPodatkeIzElementa(osobaContent, oznake));
    }

    provjeriUlaz(ulaz, oznake) {
        if (typeof ulaz !== 'string') {
            throw new Error('Ulaz mora biti string');
        }
        if (!Array.isArray(oznake)) {
            throw new Error('Oznake moraju biti niz');
        }
        if (ulaz.trim() === "") {
            return [];
        }
        if (!this.jeValjanXML(ulaz)) {
            throw new Error('Nevaljan XML');
        }
    }

    jeValjanXML(ulaz) {
        const otvoreniTagovi = [];
        const tagPattern = /<\/?([a-z]+)>/gi;
        let match;

        while ((match = tagPattern.exec(ulaz)) !== null) {
            if (match[0][1] === '/') {
                if (otvoreniTagovi.length === 0 || otvoreniTagovi.pop() !== match[1]) {
                    return false;
                }
            } else {
                otvoreniTagovi.push(match[1]);
            }
        }

        return otvoreniTagovi.length === 0;
    }

    dohvatiElementePoTagu(xml, tag) {
        const tagPattern = new RegExp(`<${tag}>(.*?)</${tag}>`, 'gs');
        const elementi = [];
        let match;

        while ((match = tagPattern.exec(xml)) !== null) {
            elementi.push(match[1]);
        }

        if (elementi.length === 0 && /<\/?[^>]+(>|$)/.test(xml)) {
            throw new Error('Nevaljan XML');
        }

        return elementi;
    }

    izvuciPodatkeIzElementa(elementContent, oznake){
        const rezultat = {};
        for(let oznaka of oznake){
            rezultat[oznaka] = this.dohvatiSadrzajElementa(elementContent, oznaka);
        }

        return rezultat;
    }

    dohvatiSadrzajElementa(xml, tag){
        const tagPattern = new RegExp(`<${tag}>(.*?)</${tag}>`, 's');
        const match = tagPattern.exec(xml);

        return match ? match[1] : null; 
    }
}

module.exports = XMLParser;
