const searchString = new URLSearchParams(window.location.search);

const status = document.getElementById('status');
const messages = document.getElementById('messages');
const input = document.getElementById('message-text');
const form = document.getElementById('chat-form');
const chat = document.getElementById('chat');
const username = document.getElementById('username');
const onlineList = document.getElementById('online-users');
const ws = new WebSocket(window.WEBSOCKET_CONNECTION_URL);

let name;

function send(name, message) {
    ws.send(JSON.stringify({
        name, message
    }))
}

// Соединение установлено
ws.onopen = () => {
    $.ajax({
        url: 'http://users.api.loc/authorization',
        type: 'POST',
        dataType: 'json',
        data: {
            token: searchString.get('token')
        },
        success(data) {
            name = data.fullName;
            send(name, ' подключился к чату')

            // Вывод имени пользователя в информационную панель
            const nameEl = document.createElement('div');
            nameEl.appendChild(document.createTextNode(`Ваше имя в чате: ${name}`));
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

    response.onlineUsersList.forEach((val) => {
        div = document.createElement('div');
        div.appendChild(document.createTextNode(val));
        if (onlineList) {
            onlineList.appendChild(div);
        }
    });
};

// Соединение закрыто
ws.onclose = function(event) {
    send(name, ' покинул чат');
};

// Ошибка
ws.onerror = function(error) {
    alert("Ошибка " + error.message);
};

// Отправка сообщения при нажатии кнопки
if (form) {
    form.addEventListener('submit', event => {
        event.preventDefault();
        if(input.value === '') return
        send(name, input.value)
        input.value = '';
    });
}

// Выход из чата
$('button[id = "logout-btn"]').click(function (e) {
    send(name, ' покинул чат');
    ws.close();
    document.location.href = '/'
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