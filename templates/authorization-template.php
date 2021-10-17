<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Авторизация</title>
    <link rel="stylesheet" href="../assets/css/main.css">
</head>
<body>

<!-- Authorization Form -->

<form>
    <label>Логин</label>
    <input type="text" name="login" placeholder="Введите логин">
    <label>Пароль</label>
    <input type="password" name="password" placeholder="Введите пароль">
    <button type="submit" id="login-btn">Войти</button>
    <p>
        Нет аккаунта? <a href="../../../php-auth/registration.php">Зарегистрироваться</a>
    </p>
    <p class="message none"></p>
</form>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="../../../php-auth/assets/js/main.js"></script>

</body>
</html>