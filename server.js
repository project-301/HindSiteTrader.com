'use strict';

// **************************************************
// Configuration and Setup
// **************************************************

// Application dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
// moment.js helps with formatting dates for the line graph
const moment = require('moment');
moment().format();

// Environment variables
require('dotenv').config();

// Application setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));
// Specify a directory for static resources
app.use(express.static('./public'));

// TODO: Middleware to handle PUT and DELETE
// Class demo code below from seattle-301d44/13-update-delete/demos/todo-app/server.js:
/*
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    // look in urlencoded POST bodies and delete it
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))
*/

// Database setup
// const client = new pg.Client(process.env.DATABASE_URL);
// client.connect();
// client.on('error', err => console.log(err));

// Sets the view engine for server-side templating
app.set('view engine', 'ejs');

// **************************************************
// Routes
// **************************************************

// Home page route
// When user navigates to site url, renders homepage (views/index.ejs)
app.get('/', getSearchForm);

// Search result route
// When user submits a search from index.ejs, renders search results view (/views/pages/result.ejs)
app.post('/result', getResults);

// Graph data route
// When result view is rendered, passes graph data to the client-side AJAX request (needed for Chart.js)
app.get('/graph-data', (request, response) => {
  response.send({ labels: chartLabels, data: chartData })
});

// Portfolio route
// When user clicks on portfolio icon in header, renders portfolio view (/views/pages/portfolio.ejs)
// app.get('/portfolio', getPortfolio);

// About route
// When user clicks on "About" link in footer, renders "about us" view (/views/pages/about.ejs)
// app.get('/about', getAbout)

// Error route / catch-all route
// Renders the error view (/views/pages/error.ejs)
app.get('*', getError);

// Make sure server is listening for requests ("flips the switch" to turn the server "on")
app.listen(PORT, () => console.log(`listening on port: ${PORT}`));

// **************************************************
// Models
// **************************************************

// Arrays to hold chart data that will be passed to the client-side app.js
// Note that these will be reset each time a Regret instance is constructed
let chartLabels = [];
let chartData = [];

function Regret(apiData, investment, name, symbol) {
  const datesArray = Object.keys(apiData['Monthly Time Series']);
  const pricesArray = Object.entries(apiData['Monthly Time Series']).map(value => value[1]['4. close'])

  // Fill arrays with data for client-side ajax request (uses Moment.js to reformat dates)
  chartLabels = datesArray.map(date => moment(date).format('MMM YYYY')).toString(); // x-coordinates
  chartData = pricesArray.toString(); // y-coordinates

  this.symbol = symbol;
  this.name = name;
  this.search_date = datesArray[0];
  this.search_date_price = pricesArray[0];
  this.past_date = datesArray.slice(-1)[0];
  this.past_price = pricesArray.slice(-1)[0];
  this.investment = investment;
  this.investment_worth = (this.investment / this.past_price) * this.search_date_price;
  this.profit = this.investment_worth - this.investment;
  this.graph_labels = chartLabels;
  this.graph_data = chartData;
}

// **************************************************
// Helper functions
// **************************************************

// Renders index.ejs view at base url
function getSearchForm(request, response) {
  response.render('index');
  app.use(express.static('./public'));
}

// Renders pages/result.ejs view on submit
function getResults(request, response) {
  console.log('fired getResults()');
  let investment = request.body.search[0];

  // Creates url for 1st API request
  // Takes string typed out by user, returns search results (and symbols)
  let url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${request.body.search[1]}&outputsize=full&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;

  superagent.get(url) // Send 1st API request
    .then(apiResponse => {
      let symbol = apiResponse.body.bestMatches[0]['1. symbol'];
      let name = apiResponse.body.bestMatches[0]['2. name'];
      console.log('132 symbol:', symbol);
      console.log('133 name:', name);

      // Creates url for 2nd API request, using symbol from 1st request
      let urlTwo = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&outputsize=full&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;

      superagent.get(urlTwo) // Send 2nd API request to get the past stock values
        .then(apiResponseTwo => new Regret(apiResponseTwo.body, investment, name, symbol)) // Run response through constructor model
        .then(regret => {
          console.log('141 regret', regret)
          return response.render('pages/result', { regret: regret })
        })
    })
}

// function getPortfolio(request, response) {
//   response.render('pages/portfolio');
//   app.use(express.static('./public'));
// }

// function getAbout(request, response) {
//   response.render('pages/about');
//   app.use(express.static('./public'));
// }

function getError(request, response) {
  // console.error(request.body);
  response.render('pages/error');
  app.use(express.static('./public'));
}
