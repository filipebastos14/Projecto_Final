axios({
    method: "get",
    url: `http://localhost:3000/despesasMensais?userId=${user.id}`,
  }).then((response) => {
    let totalArr = [];
    let categoryArr = [];
  
    response.data.map((res) => {
      totalArr.push(res.valor);
      categoryArr.push(res.categoria);
    });
  
    const ctx = document.getElementById("monthlySpendingsChart");
  
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: categoryArr,
        datasets: [
          {
            label: "Categories this month",
            data: totalArr,
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
              "rgb(201, 203, 207)",
              "rgb(54, 162, 235)",
              "beige",
              "bisque",
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: "beige",
            },
          },
        },
      },
    });
  });
  
  axios({
    method: "get",
    url: `http://localhost:3000/variacaoSemestral?userId=${user.id}`,
  }).then((response) => {
    let periods = response.data;
    const ctx2 = document.getElementById("periodVariationChart");
  
    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: ["Jan-Jun", "Jul-Dec"],
        datasets: [
          {
            label: "Period Variation",
            data: [periods[0].PrimeiroPeriodo, periods[0].SegundoPeriodo],
            fill: true,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: ["#febf00", "bisque"],
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "beige",
            },
          },
          x: {
            ticks: {
              color: "beige",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            labels: {
              color: "beige",
            },
          },
        },
      },
    });
  });
  
  axios({
    method: "get",
    url: `http://localhost:3000/maioresGastos?userId=${user.id}`,
  }).then((response) => {
    const ctx2 = document.getElementById("bigTransactionsChart");
    const data = {
      labels: response.data.map((i) => i.categoria),
      datasets: [
        {
          label: "Biggest expenses",
          data: response.data.map((i) => i.valor),
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(75, 192, 192)",
            "rgb(255, 205, 86)",
            "rgb(201, 203, 207)",
            "rgb(54, 162, 235)",
            "beige",
            "bisque",
          ],
        },
      ],
    };
  
    new Chart(ctx2, {
      type: "polarArea",
      data: data,
      options: {
        plugins: {
          legend: {
            labels: {
              color: "beige",
            },
          },
        },
      },
    });
  });
  
  axios({
    method: "get",
    url: `http://localhost:3000/rendimentosMensais?userId=${user.id}`,
  }).then((response) => {
    const ctx2 = document.getElementById("incomeChart");
    let monthsValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  
    response.data.forEach((element) => {
      monthsValues[element.month - 1] = element.valor;
    });
  
    const data = {
      labels: months,
      datasets: [
        {
          label: "Monthly income",
          data: monthsValues,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  
    new Chart(ctx2, {
      type: "line",
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              color: "beige",
            },
          },
          x: {
            ticks: {
              color: "beige",
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "beige",
            },
          },
        },
      },
    });
  });
  
  axios({
    method: "get",
    url: `http://localhost:3000/percentagensAnuais?userId=${user.id}`,
  }).then((response) => {
    let categories = document.querySelector("#categoryPercentage");
    if (categories != null) {
      categories.innerHTML = "";
      let categoriesCount = response.data.length;
  
      let nrColuna = 12 / categoriesCount;
  
      response.data.forEach((element) => {
        if (categoriesCount == 5) {
          nrColuna = 2;
        }
        categories.innerHTML += `
              <div class="CategoryAnualSpendings card col-${nrColuna}">
                <span>${element.name}</span>
                <p>${element.percentage}%</p>
              </div>
              `;
      });
    }
  });
  