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