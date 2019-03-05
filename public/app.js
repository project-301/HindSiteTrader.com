'use strict';

// DOM access variables
var canvasEl = document.getElementById('chart').getContext('2d');


// RENDERS CHART
function drawChart() {
  console.log('ran drawChart()');
  // updateChartArrays();
  var resultsChart = new Chart(canvasEl, {
    type: 'line',
    data: {
      labels: ['MMM YYYY', 'MMM YYYY', 'MMM YYYY', 'MMM YYYY', 'MMM YYYY', 'MMM YYYY', 'MMM YYYY', 'MMM YYYY', 'MMM YYYY', 'MMM YYYY'], // (Populating this with dummy data for now)
      datasets: [{
        label: '$ Value',
        data: [10, 15, 13, 15, 16, 20, 30, 35, 30, 50], // (Populating this with dummy data for now)
        backgroundColor: [ // Chart.js gradient colors created with help from a Code Fellows 201 project: http://respekt.us/index.html
          '#e5615e',
          '#db5d5b',
          '#d15a58',
          '#c75755',
          '#be5452',
          '#b4514f',
          '#aa4e4c',
          '#a04a49',
          '#974746',
          '#8d4443',
          '#834140',
          '#793e3d',
          '#703b3a',
          '#663837',
          '#5c3434',
          '#523131',
          '#492e2e',
          '#3f2b2b',
          '#352828',
          '#222222',
        ],
        borderColor: '#7A7A7A',
        borderWidth: 1
      }]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Votes'
          },
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: true,
            color: "#7A7A7A"
          }
        }]
      }
    }
  });
}

drawChart();
