const status = document.getElementById('status');
const messages = document.getElementById('messages');
const input = document.getElementById('message-text');
const form = document.getElementById('chat-form');
const chat = document.getElementById('chat');
const usernameContainer = document.getElementById('username');
const onlineList = document.getElementById('online-users-list');

const ws = new WebSocket(window.WEBSOCKET_CONNECTION_URL);

let curUserId;
let curUserName;

const sendMessage = (message) => {
    let options = {
        month: 'numeric',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric'
    };
    let time = new Date().toLocaleString('ru', options);
    ws.send(JSON.stringify({event: 'sendMessage', payload: {userName: curUserName, message, time}}));
}
const getPageMessagesFromDb = (page) => ws.send(JSON.stringify({event: 'getPageMessagesFromDb', payload: {page}}));
const connection = (token) => ws.send(JSON.stringify({event: 'connection', payload: {token}}));
const disconnection = () => ws.send(JSON.stringify({
    event: 'disconnection',
    payload: {userId: curUserId, userName: curUserName}
}));

const exit = () => ws.send(JSON.stringify({
    event: 'exit',
    payload: {userId: curUserId, userName: curUserName}
}));

// Соединение установлено
ws.onopen = () => {
    const token = localStorage.getItem('userToken');

    if (!token) {
        ws.close();
        document.location.href = '/';
        return;
    }

    document.getElementById('chat_box').classList.remove('none');
    document.getElementById('chat-info_box').classList.remove('none');

    $.ajax({
        url: 'http://users.api.loc/authorization',
        type: 'POST',
        dataType: 'json',
        data: {
            token: token
        },
        success(data) {
            curUserId = data.id;
            curUserName = data.fullName;

            // Выводим имя пользователя в информационную панель
            const nameEl = document.createElement('div');
            nameEl.innerHTML = `Ваше имя в чате: <strong>${curUserName}</strong>`;
            usernameContainer.appendChild(nameEl);

            // Добавляем пользователя в список онлайн пользователей
            connection(token);
        }
    });
};

function createMessageContainer(userName, message, time) {
    const divContainer = document.createElement('div');

    const divMessage = document.createElement('div');
    const divTime = document.createElement('div');

    if (userName === curUserName) {
        divContainer.classList.add('chat-message-container_yours')
        divMessage.classList.add('chat-message_yours');
        divMessage.innerHTML = `<strong>Вы: </strong>${message}`
        divTime.classList.add('chat-message_time_yours');
    } else {
        divContainer.classList.add('chat-message-container_another')
        divMessage.classList.add('chat-message_another');
        divMessage.innerHTML = `${userName}: ${message}`
        divTime.classList.add('chat-message_time_another');
    }

    divTime.innerHTML = `<i>${time}</i>`;

    divContainer.appendChild(divMessage);
    divContainer.appendChild(divTime);
    return divContainer;
}

function printMessage(userName, message, time) {
    const container = createMessageContainer(userName, message, time)
    chat.appendChild(container);
    chat.scrollTo(0, chat.scrollHeight);
}

function printFirstPageMessages(userName, message, time) {
    const container = createMessageContainer(userName, message, time)
    chat.insertBefore(container, chat.firstChild);
    chat.scrollTo(0, chat.scrollHeight);
}

function printMessageWhenScrolling(userName, message, time) {
    const container = createMessageContainer(userName, message, time)
    chat.insertBefore(container, chat.firstChild);
}

function printInfoMessage(message) {
    const div = document.createElement('div');
    div.classList.add('chat-info_message')
    div.innerHTML = message;
    chat.appendChild(div);
    chat.scrollTo(0, chat.scrollHeight);
}

// Получает данные с сервера
ws.onmessage = (responseServer) => {
    const json = JSON.parse(responseServer.data);
    if (!json || !json.event || !json.payload) return;

    switch (json.event) {

        case 'sendInfoMessage': {
            sendInfoMessageEvent(json.payload.userName, json.payload.message);
        }
            break;

        case 'sendOnlineList': {
            sendOnlineListEvent(json.payload.onlineNames);
        }
            break;

        case 'loadingFirstPageMessagesFromDb': {
            loadingFirstPageMessagesFromDbEvent(json.payload.results);
        }
            break;

        case 'loadingPageMessagesFromDb': {
            loadingPageMessagesFromDbEvent(json.payload.results);
        }
            break;

        case 'sendMessage': {
            sendMessageEvent(json.payload.userName, json.payload.message, json.payload.time);
        }
            break;

        case 'checkToken': {
            checkTokenEvent();
        }
            break;

        case 'error': {
            errorEvent(json.payload.error);
        }
            break;
    }
};

function sendInfoMessageEvent(userName, message) {
    if (!userName || !message) return;

    printInfoMessage(userName + ' ' + message);
}

function sendOnlineListEvent(onlineUsers){
    if (!onlineUsers) return;

    while (onlineList.firstChild) {
        onlineList.removeChild(onlineList.firstChild);
    }

    onlineUsers.forEach(function (user) {
        const div = document.createElement('div');
        div.innerHTML = '> ' + user;
        onlineList.appendChild(div);
    });
}

function loadingFirstPageMessagesFromDbEvent(userMessages) {
    if (!userMessages) return;

    userMessages.forEach(function (userMessage) {
        const userName = userMessage.userName;
        const message = userMessage.message;
        const time = userMessage.time;
        printFirstPageMessages(userName, message, time);
    });
}

function loadingPageMessagesFromDbEvent(userMessages) {
    if (!userMessages) return;

    userMessages.forEach(function (userMessage) {
        const userName = userMessage.userName;
        const message = userMessage.message;
        const time = userMessage.time;
        printMessageWhenScrolling(userName, message, time);
    });
}

function sendMessageEvent(userName, message, time) {
    if (!userName || !message || !time) return;

    printMessage(userName, message, time);
}

function checkTokenEvent() {
    if (localStorage.getItem('userToken')) return;
    ws.close();
    alert('Соединение закрыто');
    setTimeout(() => document.location.href = '/', 5000);
}

function errorEvent(error){
    if (!error) return;

    alert(error);
}

window.onbeforeunload = function () {
    disconnection();
    ws.close();
}

// Ошибка
ws.onerror = function (error) {
    alert("Ошибка " + error.message);
};

let page = 2;

chat.addEventListener('scroll', event => {
    if (chat.scrollTop < 100) {
        getPageMessagesFromDb(page++);
    }
});

// Отправка сообщения при нажатии кнопки
form.addEventListener('submit', event => {
    event.preventDefault();
    if (input.value === '') return
    sendMessage(input.value)
    input.value = '';
});

// Обработчик кнопки выход
$('button[id = "logout-btn"]').click(function () {
    exit();
    localStorage.clear();
    document.location.href = '/';
});