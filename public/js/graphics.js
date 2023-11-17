const ctx = document.getElementById('monthlySpendingsChart');

new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [
            'Food',
            'Car',
            'Others'
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    }
});

const ctx2 = document.getElementById('periodVariationChart');
const labels = ['Jan', 'Feb', 'Mar'];

new Chart(ctx2, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Period Variation',
            data: [65, 59, 80],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    }
});

const ctx3 = document.getElementById('bigTransactionsChart');

new Chart(ctx3, {
    type: 'radar',
    data: {
        labels: [
            'Eating Out',
            'Books',
            'Food',
            'Car',
            'Coding',
            'Cycling',
            'Running'
        ],
        datasets: [{
            label: 'This month',
            data: [65, 59, 200, 81, 56, 55, 40],
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }, {
            label: 'Last month',
            data: [28, 48, 40, 19, 96, 27, 100],
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
    }
});

const ctx4 = document.getElementById('incomeChart');
const labelsIncomeCHart = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

new Chart(ctx4, {
    type: 'bar',
    data: {
        labels: labelsIncomeCHart,
        datasets: [{
            label: 'Income',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
});