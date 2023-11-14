function createUser(e) {
    e.preventDefault();

    const form = document.querySelector("#new-user-form");
    console.log(form)

    axios({
        method: 'post',
        url: 'http://localhost:3000/user/new',
        data: new FormData(form)
    })
        .then(function (response) {
            location.reload();
        });
}

async function userLogin(e) {
    e.preventDefault();

    const form = document.querySelector("#new-login-form");
    let email = document.forms["new-login-form"]["email"].value;
    let pass = document.forms["new-login-form"]["pass"].value;

    axios({
        method: 'post',
        url: 'http://localhost:3000/user/login/',
        data: {
            email: email,
            pass: pass
        }
    })
    .then(function (response) {
        location.reload();
    });
}