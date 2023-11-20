const formDataReset = document.querySelector('#resetForm');
const resetBtn = document.querySelector('#reset-submit');

resetBtn.addEventListener('click', async (e) => {
    try {
        e.preventDefault();
    let form = new FormData(formDataReset);

    email = form.get('email');
    pass = form.get('psw');


    fetch('http://localhost:3000/user/reset', {
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
        const responseData = await response.json();

        alert('Atualização bem-sucedida!');

        window.location.href = '/login';
            
    }
    } catch (error) {
        console.log(error);
        alert('Erro')
    }    
});
