const chatEl = document.getElementById('chat-messages');
const ws = new WebSocket("ws://127.0.0.1:8000");
ws.onmessage = (message) => {
    const messages = JSON.parse(message.data);
    messages.forEach((val) => {
        const messageEl = document.createElement('div');
        messageEl.appendChild(document.createTextNode(`${val.name}: ${val.message}`));
        chat.appendChild(messageEl);
    })
}
const send = (event) => {
    event.preventDefault();
    // Добавить определение имени
    const name = 'Джуниор Владислав';
    const message = document.getElementById('message-text').value;
    ws.send(JSON.stringify({
        name, message
    }))
    return false;
}
const formEl = document.getElementById('chat-form');
formEl.addEventListener('submit', send);