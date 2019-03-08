'use strict';

// Show/hide details for portfolio
$('li.regret-details').hide();
$('.regret-header li').on('click', function () {
  let hiddenDetails = $(event.target).closest('li.regret-header').next('li');
  $(hiddenDetails).slideToggle('fast');
});

// AJAX request to get chart data from the server
// The server will make a SQL query to the database for the graph data corresponding to the id passed to it
$('.regret-header li').on('click', getChartData);

function getChartData() {
  let dataId = $(event.target).closest('li.saved-regret').attr('id')

  $.ajax({
    url: `/portfolio-graph/${dataId}`,
    method: 'GET',
    success: function (result) {``
      let graphData = result.data.toString().split(',').map(value => parseFloat(value));
      let graphLabels = result.labels.toString().split(',');
      drawChart(graphLabels, graphData, dataId)
    },
    error: function (err) {
      console.log('There was an error getting graph data from the server');
      console.log('heres the error:', err);
    }
  })

}


// Uses Chart.js to create a line graph with whatever x and y coordinates passed into it
function drawChart(xPointsArray, yPointsArray, canvasId) {
  console.log('ran drawChart()');
  var resultsChart = new Chart(`chart-${canvasId}`, {
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
