const formDataRegister = document.querySelector('#registerForm');
const registerBtn = document.querySelector('#register-submit');

registerBtn.addEventListener('click', async (e) => {
    console.log(1);
    console.log("clicado!");
    e.preventDefault();
    let form = new FormData(formDataRegister);

    nome = form.get('name')
    email = form.get('email');
    pass = form.get('psw');

    console.log(2);

    try {
        const response = await fetch('http://localhost:3000/user/new', {
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
        if (!response.ok) {
            const errorData = await response.json();
            
            alert(`Error: ${errorData.error}`);

        } else {
            console.log('aqui');
            window.location.href = response.url;
            alert('Registo bem-sucedido!');
        }
    } catch (error) {
        alert('Erro')
    }

});
