function generirajRasponDatuma(datumPocetka, datumKraja) {
    let datumi = [];
    let trenutniDatum = new Date(datumPocetka);
    let kraj = new Date(datumKraja);

    while (trenutniDatum <= kraj) {
        datumi.push(new Date(trenutniDatum));
        trenutniDatum.setDate(trenutniDatum.getDate() + 1);
    }
    
    return datumi;
}

async function dohvatiStatistikuPoruka() {
    const odgovor = await fetch('/baza/poruke_vremensko_razdoblje');
    const podaci = await odgovor.json();

    const datumKraja = new Date();
    const datumPocetka = new Date();
    datumPocetka.setDate(datumKraja.getDate() - 9);

    const sviDatumi = generirajRasponDatuma(datumPocetka, datumKraja);

    const podaciMapirani = new Map(podaci.map(p => [new Date(p.datum).toDateString(), p.broj_poruka]));

    const datumi = [];
    const brojPoruka = [];

    sviDatumi.forEach(datum => {
        const datumStr = datum.toDateString();
        datumi.push(datum);
        brojPoruka.push(podaciMapirani.get(datumStr) || 0);
    });

    const formatter = new Intl.DateTimeFormat('hr-HR', { month: 'short', day: 'numeric' });

    const ctx = document.getElementById('grafPorukaPoDanima').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datumi.map(d => formatter.format(d)),
            datasets: [{
                label: 'Broj poruka',
                data: brojPoruka,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Datum'
                    },
                    ticks: {
                        maxTicksLimit: 10
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Broj poruka'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

async function dohvatiStatistikuDatoteka() {
    const odgovor = await fetch('/baza/datoteke_vremensko_razdoblje');
    const podaci = await odgovor.json();

    const datumKraja = new Date();
    const datumPocetka = new Date();
    datumPocetka.setDate(datumKraja.getDate() - 9);

    const sviDatumi = generirajRasponDatuma(datumPocetka, datumKraja);

    const podaciMapirani = new Map(podaci.map(p => [new Date(p.datum).toDateString(), p.broj_datoteka]));

    const datumi = [];
    const brojDatoteka = [];

    sviDatumi.forEach(datum => {
        const datumStr = datum.toDateString();
        datumi.push(datum);
        brojDatoteka.push(podaciMapirani.get(datumStr) || 0);
    });

    const formatter = new Intl.DateTimeFormat('hr-HR', { month: 'short', day: 'numeric' });

    const ctx = document.getElementById('grafDatotekaPoDanima').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datumi.map(d => formatter.format(d)),
            datasets: [{
                label: 'Broj datoteka',
                data: brojDatoteka,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Datum'
                    },
                    ticks: {
                        maxTicksLimit: 10
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Broj datoteka'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

window.onload = function() {
    dohvatiStatistikuPoruka();
    dohvatiStatistikuDatoteka();
};
