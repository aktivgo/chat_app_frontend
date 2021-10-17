<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Профиль</title>
    <link rel="stylesheet" href="../assets/css/main.css">
</head>
<body>

<!-- Profile Page -->

<form class="profile-form">
    <img src="<?= $_SESSION['user']['avatar']?>" class="profile-image" alt="">
    <h2 class="profile-name"><?= $_SESSION['user']['fullName']?></h2>
    <a href="mailto:<?= $_SESSION['user']['email']?>" class="profile-email"><?= $_SESSION['user']['email']?></a>
    <a href="../../../php-auth/includes/logout.php" class="logout">
        <h2>Выход</h2>
    </a>
</form>

</body>
</html>