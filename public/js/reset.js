const formDataReset = document.querySelector('#resetForm');
const resetBtn = document.querySelector('#reset-submit');

resetBtn.addEventListener('click', (e) => {
    console.log("clicado!");
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
    .then(response => response)
});
