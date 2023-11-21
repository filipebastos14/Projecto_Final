const formDataReset = document.querySelector('#resetForm');
const resetBtn = document.querySelector('#reset-submit');

resetBtn.addEventListener('click', async (e) => {
    try {
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
        if (!response.ok) {
            const errorData = await response.json();
            
            alert(`Error: ${errorData.error}`);

        } else {

            alert('Atualização bem-sucedida!');

            window.location.href = response.url;
                
        }
    } catch (error) {
        console.log(error);
        alert(error)
    }    
});
