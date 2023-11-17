// const registerBtn = document.querySelector('#register-submit');


// registerBtn.onclick = function () {
//     const nomeInput = document.querySelector('#register-name');
//     const nome = nomeInput.value;
//     nomeInput.value = "";

//     const emailInput = document.querySelector('#register-email');
//     const email = emailInput.value;
//     emailInput.value = "";

//     const passlInput = document.querySelector('#register-password');
//     const pass = passlInput.value;
//     passlInput.value = "";

//     fetch('http://localhost:3000/user/new', {
//         headers: {
//             'content-type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({
//             'nome' : nome,
//             'email' : email,
//             'pass' : pass
//         })
//     })
//     //.then(response => response.json())
// }


const formDataLogin = document.querySelector('#loginForm');
const loginBtn = document.querySelector('#login-submit');

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let form = new FormData(formDataLogin);

    email = form.get('email');
    pass = form.get('psw');

    const url = `http://localhost:3000/user/login?email=${encodeURIComponent(email)}&pass=${encodeURIComponent(pass)}`;

    fetch(url, {
        headers: {
            'content-type': 'text/html; charset=utf-8'
        },
        method: 'GET'
    })
    .then(res => res.text()).then(htmlStr => {
        document.open();
        document.write(htmlStr);
        document.close();
      })
      .catch(error => console.error('Error:', error));

});


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



// loginBtn.onclick = function () {

//     const emailInput = document.querySelector('#login-email');
//     const email = emailInput.value;
//     emailInput.value = "";

//     const passlInput = document.querySelector('#login-password');
//     const pass = passlInput.value;
//     passlInput.value = "";

//     const url = `http://localhost:3000/user/login?email=${encodeURIComponent(email)}&pass=${encodeURIComponent(pass)}`;

//     fetch(url, {
//         headers: {
//             'content-type': 'text/html; charset=utf-8'
//         },
//         method: 'GET'
//     })
//     .then(res => res.text()).then(htmlStr => {
//         document.open();
//         document.write(htmlStr);
//         document.close();
//       })

// }

// const newMovBtn = document.querySelector('#movimento-submit')

// newMovBtn.onclick = function () {
//     const iserInput = document.querySelector('#user-id');
//     const user = iserInput.value;
//     iserInput.value = "";

//     const categoriaInput = document.querySelector('#categoria-id');
//     const categoria = categoriaInput.value;
//     categoriaInput.value = "";

//     const valorInput = document.querySelector('#valor');
//     const valor = valorInput.value;
//     valorInput.value = "";

//     const dataInput = document.querySelector('#data');
//     const data = dataInput.value;
//     dataInput.value = "";

//     const descricaoInput = document.querySelector('#descricao');
//     const descricao = descricaoInput.value;
//     descricaoInput.value = "";

//     const tipoInput = document.querySelector('#tipo-movimento');
//     const tipo = tipoInput.value;
//     tipoInput.value = "";



//     fetch('http://localhost:3000/mov/new', {
//         headers: {
//             'content-type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({
//             'user' : user,
//             'categoria' : categoria,
//             'valor' : valor,
//             'data': data,
//             'descricao': descricao,
//             'tipo': tipo
//         })
//     })
//     .then(response => response.json())
// }



// const logoutBtn = document.querySelector('#logout')

// logoutBtn.onclick = function () {
//     fetch('http://localhost:3000/logout')
// }

