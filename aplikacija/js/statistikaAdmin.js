async function dohvatiStatistikuPoruka() {
    const odgovor = await fetch('/baza/poruke_vremensko_razdoblje');
    const podaci = await odgovor.json();
    console.log(podaci);

    const datumi = podaci.map(p => new Date(p.datum));
    const brojPoruka = podaci.map(p => p.broj_poruka);

    const ctx = document.getElementById('grafPorukaPoDanima').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: datumi,
            datasets: [{
                label: 'Broj poruka',
                data: brojPoruka,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
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
                    }
                }
            }
        }
    });
}

window.onload = dohvatiStatistikuPoruka;
