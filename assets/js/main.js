/*
    Authorization
 */

$('button[id = "login-btn"]').click(function (e){
    e.preventDefault();

    $(`input`).removeClass('error');

    let login = $('input[name = "login"]').val(),
        password = $('input[name = "password"]').val();

    $.ajax({
        url: 'includes/signin.php',
        type: 'POST',
        dataType: 'json',
        data: {
            login: login,
            password: password
        },
        success(data) {
            if(data.status){
                document.location.href = '../../profile'
            } else{

                if(data.type === 1){
                    data.fields.forEach(function (field) {
                        $(`input[name="${field}"]`).addClass('error');
                    });
                }

                $('.message').removeClass('none').text(data.message);
            }
        }
    });
});

/*
    Getting avatar from filed
 */

let avatar = false;

$('input[name="avatar"]').change(function (e){
    avatar = e.target.files[0];
});

/*
    Registration
 */

$('button[id = "register-btn"]').click(function (e){
    e.preventDefault();

    $(`input`).removeClass('error');

    let fullName = $('input[name = "fullName"]').val(),
        login = $('input[name = "login"]').val(),
        email = $('input[name = "email"]').val(),
        password = $('input[name = "password"]').val(),
        passwordConfirm = $('input[name = "passwordConfirm"]').val();

    let formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('login', login);
    formData.append('email', email);
    formData.append('avatar', avatar);
    formData.append('password', password);
    formData.append('passwordConfirm', passwordConfirm);

    $.ajax({
        url: 'includes/signup.php',
        type: 'POST',
        dataType: 'json',
        processData: false,
        contentType: false,
        cache: false,
        data: formData,
        success(data) {
            if(data.status){
                document.location.href = '../../authorization'
            } else{
                if(data.type === 1){
                    data.fields.forEach(function (field) {
                        $(`input[name="${field}"]`).addClass('error');
                    });
                }
                $('.message').removeClass('none').text(data.message);
            }
        }
    });
});