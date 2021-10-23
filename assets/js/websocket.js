const searchString = new URLSearchParams(window.location.search);

const status = document.getElementById('status');
const messages = document.getElementById('messages');
const input = document.getElementById('message-text');
const form = document.getElementById('chat-form');
const chat = document.getElementById('chat');
const username = document.getElementById('username');
const onlineList = document.getElementById('online-users');
const chatInfo = document.getElementById('chat_info');

const ws = new WebSocket(window.WEBSOCKET_CONNECTION_URL);

let name;

// Устанавливает статус
function setStatus(value) {
    status.innerHTML = value;
}

// Соединение установлено
ws.onopen = () => {
    setStatus('ONLINE');
    $.ajax({
        url: 'http://users.api.loc/authorization',
        type: 'POST',
        dataType: 'json',
        data: {
            token: searchString.get('token')
        },
        success(data) {
            // Получение имени пользователя
            name = data.fullName;
            // Вывод сообщения о подлючении
            const message = ' подключился к чату';
            ws.send(JSON.stringify({
                name, message
            }))
            // Вывод имени пользователя в информационную панель
            const nameEl = document.createElement('div');
            nameEl.appendChild(document.createTextNode(`ИМЯ: ${name}`));
            username.appendChild(nameEl);
        }
    });
};

// Получает данные с сервера
ws.onmessage = (responseServer) => {
    const response = JSON.parse(responseServer.data);

    let div = document.createElement('div');
    div.appendChild(document.createTextNode(`${response.name}: ${response.message}`));
    chat.appendChild(div);
    chat.scrollTo(0, chat.scrollHeight);

    while (chatInfo.firstChild) {
        chatInfo.removeChild(chatInfo.firstChild);
    }

    response.onlineUsersList.forEach((val) => {
        div = document.createElement('div');
        div.appendChild(document.createTextNode(val));
        onlineList.appendChild(div);
    });
};

// Соединение закрыто
ws.onclose = () => {
    setStatus('OFFLINE');
    // Вывод сообщения об отключении
    const message = ' покинул чат';
    ws.send(JSON.stringify({
        name, message
    }))
};

// Отправка сообщения при нажатии кнопки
form.addEventListener('submit', event => {
    event.preventDefault();
    const message = input.value;
    if(message === '') return
    ws.send(JSON.stringify({
        name, message
    }))
    input.value = '';
    return false;
});

/*form.addEventListener('submit', event => {
    event.preventDefault();

    const message = input.value;
    if(message === '') return;
    ws.send(JSON.stringify({
        name, message
    }));
    input.value = '';
});*/

/*const send = (event) => {
    event.preventDefault();
    const message = document.getElementById('message-text').value;
    if(message !== '') {
        ws.send(JSON.stringify({
            name, message
        }))
    }
    return false;
}
const formEl = document.getElementById('chat-form');
formEl.addEventListener('submit', send);*/

/*
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

const nameEl = document.createElement('div');
nameEl.appendChild(document.createTextNode(`${name}`));
username.appendChild(nameEl);

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
    if(message !== '') {
        ws.send(JSON.stringify({
            name, message
        }))
    }
    return false;
}
const formEl = document.getElementById('chat-form');
formEl.addEventListener('submit', send);*/