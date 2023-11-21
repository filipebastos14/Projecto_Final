const formDataReset = document.querySelector('#resetForm');
const resetBtn = document.querySelector('#reset-submit');

resetBtn.addEventListener('click', async (e) => {
    try {
        console.log('clicado');
        e.preventDefault();
        let form = new FormData(formDataReset);

        email = form.get('email');
        pass = form.get('psw');
        pass2 = form.get('psw-repeat')

        if (pass != pass2) {
            throw new Error('As passwords não correspondem')
        }
    
        const response = await fetch('http://localhost:3000/user/reset', {
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                'email' : email,
                'pass' : pass
            })
        })
        console.log('Ainda não entrou');
        if (!response.ok) {
            console.log('Entrou not okay');
            const errorData = await response.json();
            
            alert(`Error: ${errorData.error}`);

        } else {
            console.log('Entrou okay');

            alert('Atualização bem-sucedida!');

            window.location.href = response.url;
                
        }
    } catch (error) {
        console.log(error);
        alert(error)
    }    
});
