const formDataRegister = document.querySelector('#registerForm');
const registerBtn = document.querySelector('#register-submit');

registerBtn.addEventListener('click', async (e) => {
    try {
        e.preventDefault();
        let form = new FormData(formDataRegister);

        nome = form.get('name')
        email = form.get('email');
        pass = form.get('psw');
        pass2 = form.get('psw-repeat')

        if (pass != pass2) {
            throw new Error('As passwords não correspondem')
        }
    
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
            window.location.href = response.url;
            alert('Registo bem-sucedido!');
        }
    } catch (error) {
        alert(error)
    }

});
