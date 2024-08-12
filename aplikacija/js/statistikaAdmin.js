document.addEventListener('DOMContentLoaded', async () => {
    // Dohvati osnovne podatke za prikaz
    const response = await fetch('/baza/statistika-admin');
    const data = await response.json();

    // Ažuriraj elemente na stranici
    document.getElementById('brojKorisnika').textContent = data.brojKorisnika;
    document.getElementById('brojRegistracija').textContent = data.brojRegistracija;

    // Dohvati podatke za grafikon
    const ctx = document.getElementById('porukeVremenskoRazdoblje').getContext('2d');
    const porukeData = await fetch('/baza/poruke_vremensko_razdoblje');
    const poruke = await porukeData.json();

    // Kreiraj grafikon
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: poruke.labels,
            datasets: [{
                label: 'Broj poruka',
                data: poruke.data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
