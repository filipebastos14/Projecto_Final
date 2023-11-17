axios({
    method: 'get',
    url: 'http://localhost:3000/despesasMensais'
}).then(response => {

    let totalArr = [];
    let categoryArr = [];

    response.data.map((res) => {
        console.log(res)
        totalArr.push(res.valor)
        return res
    });

    response.data.map((res) => {
        console.log(res)
        categoryArr.push(res.categoria)
        return res
    });

    const ctx = document.getElementById('monthlySpendingsChart');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categoryArr,
            datasets: [{
                label: 'My First Dataset',
                data: totalArr,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        }
    });
})

axios({
    method: 'get',
    url: 'http://localhost:3000/variacaoPeriodo'
}).then(response => {

    let totalArr = [];
    let monthsArr = [];

    response.data.map((res) => {
        console.log(res)
        totalArr.push(res.valor)
        return res
    });

    response.data.map((res) => {
        console.log(res)
        monthsArr.push(res.data.getMonth())
        return res
    });

    const ctx2 = document.getElementById('periodVariationChart');
    
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: monthsArr,
            datasets: [{
                label: 'Period Variation',
                data: totalArr,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
    });
})