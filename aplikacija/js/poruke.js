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
    scrollajNaKraj();
}

function scrollajNaKraj() {
    let razgovorDiv = document.getElementById('razgovor');
    razgovorDiv.scrollTop = razgovorDiv.scrollHeight;
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
            let fileExt = item.naziv.split('.').pop().toLowerCase();
            let fileHTML = "";
            if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
                fileHTML = `<img src="${item.putanja}" alt="${item.naziv}" style="max-width: 300px;"/>`;
            } else if (['mp3', 'wav', 'ogg'].includes(fileExt)) {
                fileHTML = `<audio controls><source src="${item.putanja}" type="audio/${fileExt}">Your browser does not support the audio element.</audio>`;
            } else if (['mp4', 'webm', 'ogg'].includes(fileExt)) {
                fileHTML = `<video controls style="max-width: 300px;"><source src="${item.putanja}" type="video/${fileExt}">Your browser does not support the video element.</video>`;
            } else {
                fileHTML = `<a href="${item.putanja}" target="_blank">${item.naziv}</a>`;
            }
            html += `<li><small>${item.korime}</small><br>${fileHTML}<br><small>${item.vrijemePrimitka}</small></li>`;
        }
    }
    popisPorukaHTML.innerHTML = html;
}

async function posaljiPoruku() {
    let korime = document.getElementById('korime').innerHTML;
    let sadrzaj = document.getElementById('novaPoruka').value;
    if(sadrzaj == '') return;
    document.getElementById('novaPoruka').value = '';
    await ucitajPoruke();
    ws.send(JSON.stringify({ type: 'new_message', posiljatelj: korime, primatelj: trenutniKontakt, sadrzaj }));
}