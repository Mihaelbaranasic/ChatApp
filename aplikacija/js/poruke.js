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
        let liClass = item.korime === document.getElementById('korime').innerHTML ? 'moja-poruka' : '';
        
        if (item.sadrzaj) {
            let procitano = item.procitano ? "✓" : "";
            html += `<li class="${liClass}"><small>${item.korime}</small><small><button onclick="prijaviPoruku(${item.id})" class="prijaviPoruku">🚩</button></small><br>${item.sadrzaj}<br><small>${item.vrijemeSlanja}</small> ${procitano}</li>`;
        } else if (item.naziv) {
            let fileExt = item.naziv.split('.').pop().toLowerCase();
            let fileHTML = '';
            if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
                fileHTML = `<img src="${item.putanja}" alt="${item.naziv}" style="max-width: 300px;"/>`;
            } else if (['mp3', 'wav', 'ogg'].includes(fileExt)) {
                fileHTML = `<audio controls><source src="${item.putanja}" type="audio/${fileExt}">Your browser does not support the audio element.</audio>`;
            } else if (['mp4', 'webm', 'ogg'].includes(fileExt)) {
                fileHTML = `<video controls style="max-width: 300px;"><source src="${item.putanja}" type="video/${fileExt}">Your browser does not support the video element.</video>`;
            } else {
                fileHTML = `<a href="${item.putanja}" target="_blank">${item.naziv}</a>`;
            }
            html += `<li class="${liClass}"><small>${item.korime}</small><small><button onclick="prijaviPoruku(${item.id})" class="prijaviPoruku">🚩</button></small><br>${fileHTML}<br><small>${item.vrijemePrimitka}</small></li>`;
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
    await fetch(`https://localhost:3100/baza/dnevnik`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            aktivnost: 'Poslana poruka korisniku '+ trenutniKontakt,
            korisnik: korime
        })
    });
}

function prijaviPoruku(porukaId) {
    let modal = document.getElementById('prijavaModal');
    let span = document.getElementsByClassName('close')[0];
    
    modal.style.display = 'block';

    document.getElementById('porukaId').value = porukaId;

    span.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
    pratiFormu(porukaId);
}

function pratiFormu(porukaId) {
    let posiljatelj = document.getElementById('korime').innerHTML;
    document.getElementById('prijavaForma').onsubmit = async function(event) {
        event.preventDefault();
        
        let razlog = document.getElementById('razlog').value;
        let detalji = document.getElementById('detalji').value;

        let sadrzaj = `Id poruke: ${porukaId}\nRazlog: ${razlog} \n\n Detalji: ${detalji}`;
        
        let odgovor = fetch('/baza/saljiMail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ posiljatelj, sadrzaj, korime: 'moderator' })
        });
        
        document.getElementById('prijavaModal').style.display = 'none';
    };
}