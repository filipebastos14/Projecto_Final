const submitButton = document.querySelector('#insertButton');
const submitButtonCategory = document.querySelector('#insertButtonCategory');
const formData = document.querySelector('#adicionar-movimentos-div')
const categorias = document.querySelector('#category-select');

axios({
    method: 'get',
    url: 'http://localhost:3000/categorias'
})
    .then(function (response) {
        categorias.innerHTML = "";

        response.data.forEach(categoria => {
            categorias.innerHTML += `
            <option value="${categoria.id_categoria}">${categoria.categoria}</option>
            `
        });

    });

axios({
    method: 'get',
    url: 'http://localhost:3000/movimentosTotais'
})
    .then(function (response) {
        let movimentosTotaisDiv = document.querySelector('#movimentos-totais');
        movimentosTotaisDiv.innerHTML = "";


        response.data.forEach(movimento => {
            let data = new Date(movimento.data);
            let corValor = '';
            corValor = movimento.tipo == 1 ? "text-danger" : "text-success";

            movimentosTotaisDiv.innerHTML += `
            <a href="#" data-id="1" class="list-group-item list-group-item-action" aria-current="true">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1" contenteditable="true">${movimento.descricao}</h5>
                            <small contenteditable="true">${data.toLocaleDateString("en-US")}</small>
                        </div>
                        <p class="mb-1 ${corValor}" contenteditable="true">${movimento.valor} <span style="color: black;">eur</span></p>
                    </a>`
        });
    });

axios({
    method: 'get',
    url: 'http://localhost:3000/proximasDespesas'
})
    .then(function (response) {
        let proximasDespesasDiv = document.querySelector('#proximas-despesas');
        proximasDespesasDiv.innerHTML = "";


        response.data.forEach(movimento => {
            let data = new Date(movimento.data);
            let corValor = '';
            corValor = movimento.tipo == 1 ? "text-danger" : "text-success";

            proximasDespesasDiv.innerHTML += `
                <a href="#" data-id="1" class="list-group-item list-group-item-action" aria-current="true">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1" contenteditable="true">${movimento.descricao}</h5>
                                <small contenteditable="true">${data.toLocaleDateString("en-US")}</small>
                            </div>
                            <p class="mb-1 ${corValor}" contenteditable="true">${movimento.valor}<span style="color: black;">eur</span></p>
                        </a>`
        });
    });

axios({
    method: 'get',
    url: 'http://localhost:3000/despesasFixasMensais'
})
    .then(function (response) {
        let despesasFixasMensaisDiv = document.querySelector('#despesas-mensais-fixas');
        despesasFixasMensaisDiv.innerHTML = "";


        response.data.forEach(movimento => {
            let data = new Date(movimento.data);

            despesasFixasMensaisDiv.innerHTML += `
                    <a href="#" data-id="1" class="list-group-item list-group-item-action" aria-current="true">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1" contenteditable="true">${movimento.descricao}</h5>
                                    <small contenteditable="true">${data.toLocaleDateString("en-US")}</small>
                                </div>
                                <p class="mb-1" contenteditable="true">${movimento.valor} <span style="color: black;">eur</span></p>
                            </a>`
        });
    });

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    let form = new FormData(formData);
    let fixo = document.querySelector('#fixoInput');
    let movimento = {
        descricao: form.get('descricao'),
        valor: form.get('valor'),
        data: form.get('data'),
        categoria: form.get('categorias'),
        fixo: fixo.checked,
        tipo: form.get('tipo'),
    }

    console.log(form.get('categorias'))

    axios({
        method: 'post',
        url: 'http://localhost:3000/inserirMovimento',
        data: movimento
    })
        .then(function (response) {
            location.reload();
        });


})

submitButtonCategory.addEventListener('click', (e) => {
    e.preventDefault();
    let categoryName = document.querySelector('#idNovaCategoria');

    axios({
        method: 'post',
        url: `http://localhost:3000/novaCategoria?name=${categoryName.value}` 
    })
        .then(function (response) {
            location.reload();
        });
})