'use strict';

// DOM access variables
var canvasEl = document.getElementById('chart').getContext('2d');

// AJAX request to get chart data from server
$(document).ready(function () { // Runs on page load
  console.log('ran fetchChartData');

  $.ajax({
    // url is the current url up until the last foward-slash + /graph-data (the route server.js is listening for)
    url: `${window.location.href.substr(0, window.location.href.lastIndexOf('/'))}/graph-data`,
    method: 'GET',
    context: document.body
  })

    .then(serverResponse => { // the response from server.js is an object with two keys: data and labels
      let chartDataArray = serverResponse.data.split(',').map(value => parseFloat(value));
      let chartLabelsArray = serverResponse.labels.split(',');
      drawChart(chartLabelsArray, chartDataArray); // draws the chart with the server response data
    })

    .catch(error => {
      console.log('error:', error)
    });
})

// Uses Chart.js to create a line graph with whatever x and y coordinates passed into it
function drawChart(xPointsArray, yPointsArray) {
  console.log('ran drawChart()');
  var resultsChart = new Chart(canvasEl, {
    type: 'line',
    data: {
      labels: xPointsArray, // x-coordinates
      datasets: [{
        label: '$ Value',
        data: yPointsArray, // y-coordinates
        backgroundColor: '#fff27f',
        borderColor: '#5c1fac'
      }]
    },
    options: {
      legend: {
        display: false,
      },
      elements: {
        point: {
          radius: 0
        }
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: true,
            color: "#ab7de7"
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Value'
          },
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: true,
            color: "#ab7de7"
          }
        }]
      }
    }
  });
}
