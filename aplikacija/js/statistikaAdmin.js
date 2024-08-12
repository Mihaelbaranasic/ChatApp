async function dohvatiStatistikuPoruka() {
    const odgovor = await fetch('/baza/poruke_vremensko_razdoblje');
    const podaci = await odgovor.json();
    console.log(podaci);

    const datumi = podaci.map(p => new Date(p.datum));
    const brojPoruka = podaci.map(p => p.broj_poruka);

    const ctx = document.getElementById('grafPorukaPoDanima').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datumi,
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
                    type: 'time',
                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'HH:mm'
                        },
                        tooltipFormat: 'HH:mm'
                    },
                    title: {
                        display: true,
                        text: 'Vrijeme'
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
                    display: true
                }
            }
        }
    });
}

async function dohvatiStatistikuDatoteka() {
    const odgovor = await fetch('/baza/datoteke_vremensko_razdoblje');
    const podaci = await odgovor.json();
    console.log(podaci);

    const datumi = podaci.map(p => new Date(p.datum));
    const brojDatoteka = podaci.map(p => p.broj_datoteka);

    const ctx = document.getElementById('grafDatotekaPoDanima').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datumi,
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
                    type: 'time',
                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'HH:mm'
                        },
                        tooltipFormat: 'HH:mm'
                    },
                    title: {
                        display: true,
                        text: 'Datum'
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
                    display: true
                }
            }
        }
    });
}

window.onload = function() {
    dohvatiStatistikuPoruka();
    dohvatiStatistikuDatoteka();
};
