axios({
  method: "get",
  url: `http://localhost:3000/detalhesConta?userId=${user.id}`,
}).then(function (response) {
  let contaAtualDetalhes = document.querySelector("#contaAtualDetalhes");
  let saldoDetalhes = document.querySelector("#saldoDetalhes");
  let emailDetalhes = document.querySelector("#emailDetalhes");

  response.data.forEach((detalhes) => {
    contaAtualDetalhes.insertAdjacentHTML('afterend',`<span style="font-size: 1.5rem;">${detalhes.nome}</span>`);
    saldoDetalhes.insertAdjacentHTML('afterend',`<span style="font-size: 1.5rem;">${detalhes.saldo}€</span>`);
    emailDetalhes.insertAdjacentHTML('afterend',`<span style="font-size: 1.5rem;">${detalhes.email}</span>`);
  });
});
