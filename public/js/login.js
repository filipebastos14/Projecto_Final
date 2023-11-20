const formDataLogin = document.querySelector('#loginForm');
const loginBtn = document.querySelector('#login-submit');

loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    let form = new FormData(formDataLogin);

    email = form.get('email');
    pass = form.get('psw');

    try {
        const url = `http://localhost:3000/user/login?email=${encodeURIComponent(email)}&pass=${encodeURIComponent(pass)}`;

        const response = await fetch(url, {
            headers: {
            'content-type': 'text/html; charset=utf-8'
        },
        method: 'GET'
        })
        if (!response.ok) {
            console.log("not okay");
            const errorData = await response.json();
            
            alert(`Error: ${errorData.error}`);

        } else {
            const responseData = await response.json();

        if (responseData.success) {
            window.location.href = '/';
        } else {
            alert(`Error: ${responseData.error}`);
        }
            
        }
    } catch (error) {
        console.log(error);
        alert('Erro')
    }

});