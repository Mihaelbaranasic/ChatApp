async function ucitajPoruke() {
    let korime = document.getElementById('korime').innerHTML;
    let parametri = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    };
    let odgovor = await fetch(`${url}/baza/poruke/${korime}/${trenutniKontakt}`, parametri);
    let poruke = await odgovor.json();
    
    let datoteke = await fetch(`${url}/baza/datoteke/${korime}/${trenutniKontakt}`, parametri);
    let datotekeData = await datoteke.json();

    prikaziPorukeIDatoteke(poruke, datotekeData);
}

function prikaziPorukeIDatoteke(poruke, datoteke) {
    let popisPorukaHTML = document.getElementById('listaPoruka');
    let svePorukeIDatoteke = [...poruke, ...datoteke];

    svePorukeIDatoteke.sort((a, b) => new Date(a.vrijemeSlanja || a.vrijemePrimitka) - new Date(b.vrijemeSlanja || b.vrijemePrimitka));

    let html = "";
    for (let item of svePorukeIDatoteke) {
        if (item.sadrzaj) {
            let procitano = item.procitano ? "✓" : "";
            html += `<li onmouseover='oznaciPorukuProcitanom(${item.id})'><small>${item.korime}</small><br>${item.sadrzaj}<br><small>${item.vrijemeSlanja}</small> ${procitano}</li>`;
        } else if (item.naziv) {
            html += `<li><small>${item.korime}</small><br><a href="${item.putanja}" target="_blank">${item.naziv}</a><br><small>${item.vrijemePrimitka}</small></li>`;
        }
    }
    popisPorukaHTML.innerHTML = html;
}

async function posaljiPoruku() {
    let korime = document.getElementById('korime').innerHTML;
    let sadrzaj = document.getElementById('novaPoruka').value;
    document.getElementById('novaPoruka').value = '';
    await ucitajPoruke();
    ws.send(JSON.stringify({ type: 'new_message', posiljatelj: korime, primatelj: trenutniKontakt, sadrzaj }));
}