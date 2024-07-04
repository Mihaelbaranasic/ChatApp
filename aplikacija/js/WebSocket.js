function postaviWebSocket() {
    ws = new WebSocket('ws://localhost:3000');
    ws.onopen = () => console.log('WebSocket veza otvorena');
    ws.onmessage = (event) => {
        let data = JSON.parse(event.data);
        if (data.type === 'new_message') {
            if (data.posiljatelj === trenutniKontakt || data.primatelj === trenutniKontakt) {
                ucitajPoruke();
            }
        }
        if (data.type === 'new_file') {
            if (data.posiljatelj === trenutniKontakt || data.primatelj === trenutniKontakt) {
                ucitajPoruke();
            }
        }
    };
    ws.onclose = () => console.log('WebSocket veza zatvorena');
}
