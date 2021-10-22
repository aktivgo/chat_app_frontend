const searchString = new URLSearchParams(window.location.search);
const ws = new WebSocket(window.WEBSOCKET_CONNECTION_URL);

let name;

$.ajax({
    url: 'http://users.api.loc/authorization',
    type: 'POST',
    dataType: 'json',
    data: {
        token: searchString.get('token')
    },
    success(data) {
        name = data.fullName;
    }
});

ws.onmessage = (message) => {
    const messages = JSON.parse(message.data);
    const chat = document.getElementById('chat');
    messages.forEach((val) => {
        const messageEl = document.createElement('div');
        messageEl.appendChild(document.createTextNode(`${val.name}: ${val.message}`));
        chat.appendChild(messageEl);
        chat.scrollTo(0, chat.scrollHeight);
    })
}
const send = (event) => {
    event.preventDefault();
    const message = document.getElementById('message-text').value;
    ws.send(JSON.stringify({
        name, message
    }))
    return false;
}
const formEl = document.getElementById('chat-form');
formEl.addEventListener('submit', send);