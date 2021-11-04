if(localStorage.getItem('userToken')) {
    window.location.href = '/chat';
}

/*
    Authorization
 */

$('button[id = "login-btn"]').click(function (e){
    e.preventDefault();

    $(`input`).removeClass('error');

    let login = $('input[name = "login"]').val(),
        password = $('input[name = "password"]').val();

    $.ajax({
        url: window.AUTHORIZATION_URL,
        type: 'POST',
        dataType: 'json',
        data: {
            login: login,
            password: password
        },
        success(data) {
            if(data.status){
                localStorage.setItem('userToken', data.token);
                document.location.href = '/chat';
            } else{
                data.fields.forEach(function (field) {
                    $(`input[name="${field}"]`).addClass('error');
                });
                $('.message').removeClass('none').text(data.message);
            }
        }
    });
});

/*
    Registration
 */

$('button[id = "register-btn"]').click(function (e){
    e.preventDefault();

    $(`input`).removeClass('error');

    let fullName = $('input[name = "fullName"]').val(),
        login = $('input[name = "login"]').val(),
        password = $('input[name = "password"]').val(),
        passwordConfirm = $('input[name = "passwordConfirm"]').val();

    let formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('login', login);
    formData.append('password', password);
    formData.append('passwordConfirm', passwordConfirm);

    $.ajax({
        url: window.REGISTRATION_URL,
        type: 'POST',
        dataType: 'json',
        processData: false,
        contentType: false,
        cache: false,
        data: formData,
        success(data) {
            if(data.status){
                document.location.href = '/authorization'
            } else{
                data.fields.forEach(function (field) {
                    $(`input[name="${field}"]`).addClass('error');
                });
                $('.message').removeClass('none').text(data.message);
            }
        }
    });
});