'use strict';

// var canvasEl = document.getElementById('chart').getContext('2d');

let canvasElArray = $('canvas').map(canvas => canvas.html);
console.log(canvasElArray);


// Show/hide details for portfolio
$('li.regret-details').hide();
$('.regret-header li').on('click', function () {
  // console.log('event.target:', event.target);
  let hiddenDetails = $(event.target).closest('li.regret-header').next('li');
  // console.log('thing to show:', hiddenDetails);
  $(hiddenDetails).slideToggle('fast');
});

// AJAX request to get chart data from the server
// The server will make a SQL query to the database for the graph data corresponding to the id passed to it
$('.regret-header li').on('click', getChartData);

function getChartData() {
  let dataId = $(event.target).closest('li.saved-regret').attr('id')
  console.log(dataId);

  $.ajax({
    url: `/portfolio-graph/${dataId}`,
    method: 'GET',
    success: function (result) {
      // $('h1').append(result.data.toString());
      let graphData = result.data.toString().split(',').map(value => parseFloat(value));
      let graphLabels = result.labels.toString().split(',');
      drawChart(graphLabels, graphData)
    },
    error: function (err) {
      console.log('There was an error getting graph data from the server');
      console.log('heres the error:', err);
    }
  })

}


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
