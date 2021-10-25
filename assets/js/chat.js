const searchString = new URLSearchParams(window.location.search);

const status = document.getElementById('status');
const messages = document.getElementById('messages');
const input = document.getElementById('message-text');
const form = document.getElementById('chat-form');
const chat = document.getElementById('chat');
const username = document.getElementById('username');
const onlineList = document.getElementById('online-users-list');
const ws = new WebSocket(window.WEBSOCKET_CONNECTION_URL);

let curUserId;
let curUserName;

const sendMessage = (message) => ws.send(JSON.stringify({event: "sendMessage", payload: {curUserName, message}}));
const addUser = () => ws.send(JSON.stringify({event: "addUser", payload: {curUserId, curUserName}}));
const deleteUser = () => ws.send(JSON.stringify({event: "deleteUser", payload: {curUserId, curUserName}}));

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
            curUserId = data.id;
            curUserName = data.fullName;
            // Выводим имя пользователя в информационную панель
            const nameEl = document.createElement('div');
            nameEl.innerHTML = `Ваше имя в чате: <strong>${curUserName}</strong>`;
            username.appendChild(nameEl);
            // Добавляем пользователя в список онлайн пользователей
            addUser();
        },
        error() {
            document.location.href = '/';
        }
    });
};

// Получает данные с сервера
ws.onmessage = (responseServer) => {
    const json = JSON.parse(responseServer.data);

    switch (json.event) {

        case 'sendMessage': {
            const userName = json.payload.userName;
            const userMessage = json.payload.userMessage;
            const div = document.createElement('div');
            div.classList.add('chat-message')
            if (userName === curUserName) {
                div.style.textAlign = 'right';
                div.innerHTML = `<strong>Вы: </strong>${userMessage}`
            } else {
                div.innerHTML = `${userName}: ${userMessage}`
            }
            chat.appendChild(div);
            chat.scrollTo(0, chat.scrollHeight);
        }
            break;

        case 'eventUser': {
            const infoMessage = json.payload.infoMessage;
            const div = document.createElement('div');
            div.classList.add('chat-message')
            div.style.textAlign = 'center';
            div.innerHTML = infoMessage;
            chat.appendChild(div);
            chat.scrollTo(0, chat.scrollHeight);

            const onlineUsers = json.payload.onlineNames;

            while (onlineList.firstChild) {
                onlineList.removeChild(onlineList.firstChild);
            }

            onlineUsers.forEach(function (user) {
                const div = document.createElement('div');
                div.appendChild(document.createTextNode('> ' + user));
                onlineList.appendChild(div);
            });
        }
            break;

        case 'getMessagesFromDb': {
            const userMessages = json.payload.results;

            userMessages.forEach(function (userMessage) {
                const name = userMessage.userName;
                const message = userMessage.message;
                const div = document.createElement('div');
                div.classList.add('chat-message')
                if (name === curUserName) {
                    div.style.textAlign = 'right';
                    div.innerHTML = `<strong>Вы: </strong>${message}`
                } else {
                    div.innerHTML = `${name}: ${message}`
                }
                chat.appendChild(div);
                chat.scrollTo(0, chat.scrollHeight);
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