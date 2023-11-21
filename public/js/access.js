axios({
    method: 'get',
    url: `http://localhost:3000/saldoActual?userId=${user.id}`,
})
    .then(function (response) {
        let saldoActualDiv = document.querySelector('#saldo-actual-div');
        let total = response.data[0].total;

        if (total == null) {
            saldo = 0
        } else {
            saldo = total
        }

        saldoActualDiv.innerHTML = `<p>${saldo}€</p>`;
    });


axios({
    method: 'get',
    url: `http://localhost:3000/ultimosMovimentos?userId=${user.id}`
})
    .then(function (response) {
        let ultimosMovimentosDiv = document.querySelector('#ultimo-movimentos-div');

        ultimosMovimentosDiv.innerHTML = '';
        response.data.forEach(movimento => {
            let formatData = new Date(movimento.data);
            ultimosMovimentosDiv.innerHTML += `
            <a href="#" data-id="1" onclick="toggleActive(this)" class="list-group-item list-group-item-action" aria-current="true">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${movimento.descricao}</h5>
                    <small>${formatData.toLocaleDateString("en-US")}</small>
                </div>
                <p class="mb-1 ${movimento.tipo==0? "text-success" : "text-danger"}">${movimento.valor}€</p>
            </a>
            `;
        });
    });

axios({
    method: 'get',
    url: `http://localhost:3000/movimentosAnual?userId=${user.id}`
})
    .then(function (response) {
        const ctx = document.getElementById('historicoAnual');

        let data = [0,0,0,0,0,0,0,0,0,0,0,0];
        response.data.forEach(movimentoMes => {
            data[movimentoMes.mes-1] = movimentoMes.valor;
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Expenses',
                    data: data,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: "beige"
                        }
                    },
                    x: {
                        ticks: {
                            color: "beige"
                        }
                    }
                }, plugins: {
                    legend: {
                        labels: {
                            color: "beige"
                        }
                    }
                }
            }
        });
    });