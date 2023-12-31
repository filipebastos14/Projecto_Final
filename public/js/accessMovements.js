const submitButton = document.querySelector("#insertButton");
const submitButtonCategory = document.querySelector("#insertButtonCategory");
const formData = document.querySelector("#adicionar-movimentos-div");
const categorias = document.querySelector("#category-select");
const tipoMovimento = document.querySelector("#tipoSelect");

axios({
  method: "get",
  url: `http://localhost:3000/getCategorias?userId=${user.id}`,
}).then(function (response) {
  categorias.innerHTML =
    '<option value="" selected disabled>Choose a category</option>';

  response.data.forEach((categoria) => {
    categorias.innerHTML += `
            <option value="${categoria.id}">${categoria.categoria}</option>
            `;
  });
});

axios({
  method: "get",
  url: `http://localhost:3000/movimentosTotais?userId=${user.id}`,
}).then(function (response) {
  let movimentosTotaisDiv = document.querySelector("#movimentos-totais");
  movimentosTotaisDiv.innerHTML = "";

  response.data.forEach((movimento) => {
    let data = new Date(movimento.data);
    let corValor = "";
    corValor = movimento.tipo == 1 ? "text-danger" : "text-success";

    movimentosTotaisDiv.innerHTML += `
            <a href="#" data-id="${
              movimento.id
            }" class="list-group-item list-group-item-action" aria-current="true">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1" contenteditable="true">${
                              movimento.descricao
                            }</h5>
                            <small contenteditable="true">${data.toLocaleDateString(
                              "en-US"
                            )}</small>
                        </div>
                        <div class="d-flex w-100 justify-content-between">
                            <p class="mb-1 ${corValor}" contenteditable="true">${
      movimento.valor
    }€</p>
                            <form action="/delete-movement/${
                              movimento.id
                            }" method="post">
                            <button class="deleteMovement"><i class="bi bi-trash"></i></button>
                            </form>
                            </div>
                    </a>`;
  });
});

axios({
  method: "get",
  url: `http://localhost:3000/proximasDespesas?userId=${user.id}`,
}).then(function (response) {
  let proximasDespesasDiv = document.querySelector("#proximas-despesas");
  proximasDespesasDiv.innerHTML = "";

  response.data.forEach((movimento) => {
    let data = new Date(movimento.data);
    let corValor = "";
    corValor = movimento.tipo == 1 ? "text-danger" : "text-success";

    proximasDespesasDiv.innerHTML += `
                <a href="#" data-id="${
                  movimento.id
                }" class="list-group-item list-group-item-action" aria-current="true">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1" contenteditable="true">${
                                  movimento.descricao
                                }</h5>
                                <small contenteditable="true">${data.toLocaleDateString(
                                  "en-US"
                                )}</small>
                            </div>
                            <div class="d-flex w-100 justify-content-between">
                                <p class="mb-1 ${corValor}" contenteditable="true">${
      movimento.valor
    }€</p>
                                <form action="/delete-movement/${
                                  movimento.id
                                }" method="post">
                            <button class="deleteMovement"><i class="bi bi-trash"></i></button>
                            </form>
                            </div>
                        </a>`;
  });
});

axios({
  method: "get",
  url: `http://localhost:3000/despesasFixasMensais?userId=${user.id}`,
}).then(function (response) {
  let despesasFixasMensaisDiv = document.querySelector(
    "#despesas-mensais-fixas"
  );
  despesasFixasMensaisDiv.innerHTML = "";

  response.data.forEach((movimento) => {
    corValor = movimento.tipo == 1 ? "text-danger" : "text-success";
    let data = new Date(movimento.data);

    despesasFixasMensaisDiv.innerHTML += `
                    <a href="#" data-id="${
                      movimento.id
                    }" class="list-group-item list-group-item-action" aria-current="true">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1" contenteditable="true">${
                                      movimento.descricao
                                    }</h5>
                                    <small contenteditable="true">${data.toLocaleDateString(
                                      "en-US"
                                    )}</small>
                                </div>
                                <div class="d-flex w-100 justify-content-between">
                                    <p class="mb-1 ${corValor}" contenteditable="true">${
      movimento.valor
    }€</p>
                                    <form action="/delete-movement/${
                                      movimento.id
                                    }" method="post">
                            <button class="deleteMovement"><i class="bi bi-trash"></i></button>
                            </form>
                                </div>
                                
                            </a>`;
  });
});

submitButton.addEventListener("click", (event) => {
  event.preventDefault();

  let form = new FormData(formData);
  let fixo = document.querySelector("#fixoInput");
  let movimento = {
    user: user.id,
    descricao: form.get("descricao"),
    valor: form.get("valor"),
    data: form.get("data"),
    categoria: form.get("categorias"),
    fixo: fixo.checked,
    tipo: form.get("tipo"),
  };

  axios({
    method: "post",
    url: "http://localhost:3000/inserirMovimento",
    data: movimento,
  }).then(function (response) {
    location.reload();
  });
});

submitButtonCategory.addEventListener("click", (event) => {
  event.preventDefault();
  let categoryName = document.querySelector("#idNovaCategoria");
  console.log(categoryName.value);
  axios({
    method: "post",
    url: `http://localhost:3000/novaCategoria?name=${categoryName.value}`,
  }).then(function (response) {
    location.reload();
  });
});

tipoMovimento.addEventListener("click", (event) => {
  event.preventDefault();
  toggleFixo();
});
toggleFixo();
function toggleFixo() {
  let fixo = document.querySelector("#fixoInput");
  if (tipoMovimento.value == 0) {
    fixo.setAttribute("disabled", "");
    fixo.value = 0;
  } else {
    fixo.removeAttribute("disabled");
  }
}


