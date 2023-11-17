const formDataRegister = document.querySelector('#registerForm');
const registerBtn = document.querySelector('#register-submit');

registerBtn.addEventListener('click', (e) => {
    console.log(1);
    console.log("clicado!");
    e.preventDefault();
    let form = new FormData(formDataRegister);

    nome = form.get('name')
    email = form.get('email');
    pass = form.get('psw');

    console.log(2);

    fetch('http://localhost:3000/user/new', {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            'nome' : nome,
            'email' : email,
            'pass' : pass
        })
    })
    .then(response => response)
});
