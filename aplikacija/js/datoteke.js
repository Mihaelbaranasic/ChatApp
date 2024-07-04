async function posaljiDatoteku() {
    let korime = document.getElementById('korime').innerHTML;
    let fileInput = document.getElementById('datoteka');
    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append('datoteka', file);
    formData.append('posiljatelj', korime);
    formData.append('primatelj', trenutniKontakt);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', `${url}/baza/datoteke`, true);
    xhr.onload = function () {
        if (xhr.status === 201) {
            console.log('Datoteka poslana');
            ws.send(JSON.stringify({ type: 'new_file', posiljatelj: korime, primatelj: trenutniKontakt, naziv: file.name, putanja: xhr.responseURL }));
            fileInput.value = '';
        } else {
            console.error('Greška kod slanja datoteke');
        }
    };
    xhr.send(formData);
}
