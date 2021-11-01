const status = document.getElementById('status');
const messages = document.getElementById('messages');
const input = document.getElementById('message-text');
const form = document.getElementById('chat-form');
const chat = document.getElementById('chat');
const usernameContainer = document.getElementById('username');
const onlineList = document.getElementById('online-users-list');

const ws = new WebSocket(window.WEBSOCKET_CONNECTION_URL);

// id и имя текущего пользователя
let curUserId;
let curUserName;

// Запросы на сервер
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

/*
 Соединение установлено
 */
ws.onopen = () => {
    const token = localStorage.getItem('userToken');

    if (!token) {
        ws.close();
        document.location.href = '/';
        return;
    }

    removeClassNone();
    makeAjaxRequest(token);
};

function removeClassNone() {
    document.getElementById('chat_box').classList.remove('none');
    document.getElementById('chat-info_box').classList.remove('none');
}

function makeAjaxRequest(token) {
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

            printUserName();
            connection(token);
        }
    });
}

function printUserName() {
    const nameEl = document.createElement('div');
    nameEl.innerHTML = `Ваше имя в чате: <strong>${curUserName}</strong>`;
    usernameContainer.appendChild(nameEl);
}


/*
 Получение сообщений от сервера
 */
ws.onmessage = (responseServer) => {
    const json = JSON.parse(responseServer.data);
    if (!json || !json.event || !json.payload) return;

    switch (json.event) {

        case 'sendInfoMessage': {
            sendInfoMessageEvent(json.payload.userName, json.payload.message);
        }
            break;

        case 'updateOnlineList': {
            updateOnlineListEvent(json.payload.onlineNames);
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

function printInfoMessage(message) {
    const container = createInfoMessageContainer(message);
    chat.appendChild(container);
    chat.scrollTo(0, chat.scrollHeight);
}

function createInfoMessageContainer(message) {
    const container = document.createElement('div');
    container.classList.add('chat-info_message')
    container.innerHTML = message;
    return container;
}

function updateOnlineListEvent(onlineUsers) {
    if (!onlineUsers) return;

    clearOnlineUsersContainer();
    printOnlineUsers(onlineUsers);
}

function clearOnlineUsersContainer() {
    while (onlineList.firstChild) {
        onlineList.removeChild(onlineList.firstChild);
    }
}

function printOnlineUsers(onlineUsers) {
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

function printFirstPageMessages(userName, message, time) {
    printMessagesWhenScrolling(userName, message, time)
    chat.scrollTo(0, chat.scrollHeight);
}

function printMessagesWhenScrolling(userName, message, time) {
    const container = createMessageContainer(userName, message, time)
    chat.insertBefore(container, chat.firstChild);
}

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

function loadingPageMessagesFromDbEvent(userMessages) {
    if (!userMessages) return;

    userMessages.forEach(function (userMessage) {
        const userName = userMessage.userName;
        const message = userMessage.message;
        const time = userMessage.time;
        printMessagesWhenScrolling(userName, message, time);
    });
}

function sendMessageEvent(userName, message, time) {
    if (!userName || !message || !time) return;

    printMessage(userName, message, time);
}

function printMessage(userName, message, time) {
    const container = createMessageContainer(userName, message, time)
    chat.appendChild(container);
    chat.scrollTo(0, chat.scrollHeight);
}

function checkTokenEvent() {
    if (localStorage.getItem('userToken')) return;
    ws.close();
    alert('Соединение закрыто');
    setTimeout(() => document.location.href = '/', 5000);
}

function errorEvent(error) {
    if (!error) return;

    alert(error);
}


window.onbeforeunload = function () {
    disconnection();
    ws.close();
}

ws.onerror = function (error) {
    alert("Ошибка " + error.message);
};

let page = 2;
chat.addEventListener('scroll', () => {
    if (chat.scrollTop < 100) {
        getPageMessagesFromDb(page++);
    }
});

// Отправка сообщения при нажатии кнопки
form.addEventListener('submit', event => {
    event.preventDefault();
    if (input.value === '') return;
    sendMessage(input.value);
    input.value = '';
});

// Обработчик кнопки выход
$('button[id = "logout-btn"]').click(function () {
    exit();
    localStorage.clear();
    document.location.href = '/';
});