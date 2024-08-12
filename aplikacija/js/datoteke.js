async function posaljiDatoteku() {
    let korime = document.getElementById('korime').innerHTML;
    let fileInput = document.getElementById('datoteka');
    let file = fileInput.files[0];
    if(file == undefined) return;
    let formData = new FormData();
    formData.append('datoteka', file);
    formData.append('posiljatelj', korime);
    formData.append('primatelj', trenutniKontakt);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', `${url}/baza/datoteke`, true);
    xhr.onload = async function () {
        if (xhr.status === 201) {
            console.log('Datoteka poslana');
            ws.send(JSON.stringify({ type: 'new_file', posiljatelj: korime, primatelj: trenutniKontakt, naziv: file.name, putanja: xhr.responseURL }));
            fileInput.value = '';
            await fetch(`http://localhost:3000/baza/dnevnik`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    aktivnost: 'Poslana datoteka korisniku '+ trenutniKontakt,
                    korisnik: korime
                })
            });
        } else {
            console.error('Greška kod slanja datoteke');
        }
    };
    xhr.onerror = function () {
        console.error('Greška kod slanja datoteke');
    };
    xhr.send(formData);
}
