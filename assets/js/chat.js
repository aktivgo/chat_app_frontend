const searchString = new URLSearchParams(window.location.search);

const status = document.getElementById('status');
const messages = document.getElementById('messages');
const input = document.getElementById('message-text');
const form = document.getElementById('chat-form');
const chat = document.getElementById('chat');
const username = document.getElementById('username');
const onlineList = document.getElementById('online-users');
const ws = new WebSocket(window.WEBSOCKET_CONNECTION_URL);

let userId;
let userName;

const sendMessage = (message) => ws.send(JSON.stringify({event: "sendMessage", payload: {userName, message}}));
const addUser = () => ws.send(JSON.stringify({event: "addUser", payload: {userId, userName}}));
const deleteUser = () => ws.send(JSON.stringify({event: "deleteUser", payload: {userId, userName}}));

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
            userId = data.id;
            userName = data.fullName;
            // Выводим имя пользователя в информационную панель
            const nameEl = document.createElement('div');
            nameEl.appendChild(document.createTextNode(`Ваше имя в чате: ${userName}`));
            username.appendChild(nameEl);
            // Добавляем пользователя в список онлайн пользователей
            addUser();
        }
    });
};

// Получает данные с сервера
ws.onmessage = (responseServer) => {
    const json = JSON.parse(responseServer.data);
    console.log(json);

    switch (json.event) {

        case 'sendMessage': {
            const userName = json.payload.userName;
            const userMessage = json.payload.userMessage;
            const div = document.createElement('div');
            div.appendChild(document.createTextNode(`${userName}: ${userMessage}`));
            chat.appendChild(div);
            chat.scrollTo(0, chat.scrollHeight);
        }
            break;

        case 'eventUser': {
            const infoMessage = json.payload.infoMessage;
            const div = document.createElement('div');
            div.appendChild(document.createTextNode(infoMessage));
            chat.appendChild(div);
            chat.scrollTo(0, chat.scrollHeight);

            const onlineUsers = json.payload.onlineNames;
            console.log(onlineUsers);

            while (onlineList.firstChild) {
                onlineList.removeChild(onlineList.firstChild);
            }

            onlineUsers.forEach(function(user) {
                const div = document.createElement('div');
                div.appendChild(document.createTextNode('>' + user));
                onlineList.appendChild(div);
            });
        }
            break;

        case 'error': {
            const error = json.payload.error;
            alert(error);
        }
            break;
    }
};

// Происходит после закрытия страницы
window.onbeforeunload = function () {
    deleteUser();
    ws.close();
}

// Соединение закрыто
ws.onclose = function (event) {
    deleteUser();
};

// Ошибка
ws.onerror = function (error) {
    alert("Ошибка " + error.message);
};

// Отправка сообщения при нажатии кнопки
form.addEventListener('submit', event => {
    event.preventDefault();
    if (input.value === '') return
    sendMessage(input.value)
    input.value = '';
});

// Обработчик кнопки выход
$('button[id = "logout-btn"]').click(function () {
    window.onbeforeunload;
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