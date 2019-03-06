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
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));

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
  response.send({ labels: latestSavedRegretObj.graph_labels, data: latestSavedRegretObj.graph_data })
});

// TODO "Save Regret" route
// When user clicks "Save to my results" button, update latest Regret object to contain new Regret created in getResults() function
// THEN insert the Regret object into DB
// THEN redirect user to portfolio.ejs view
app.post('/save-regret', saveRegret);

// TODO Portfolio route
// When user clicks on portfolio icon in header (OR clicks "Save to my regrets" button), render portfolio view (/views/pages/portfolio.ejs)
app.get('/portfolio', getPortfolio);

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
// let chartLabels = [];
// let chartData = [];
let latestSavedRegretObj = {}; // Will temporarily store whole regret object created in getResults() function

function Regret(apiPriceData, investment, name, symbol) {
  const datesArray = Object.keys(apiPriceData['Monthly Time Series']);
  const pricesArray = Object.entries(apiPriceData['Monthly Time Series']).map(value => value[1]['4. close']);

  this.symbol = symbol;
  this.name = name;
  this.search_date = datesArray[0];
  this.search_date_price = pricesArray[0];
  this.past_date = datesArray.slice(-1)[0];
  this.past_price = pricesArray.slice(-1)[0];
  this.investment = investment;
  this.investment_worth = (this.investment / this.past_price) * this.search_date_price;
  this.profit = this.investment_worth - this.investment;

  // Fill arrays with data for client-side ajax request (uses Moment.js to reformat dates)
  this.graph_labels = datesArray.map(date => moment(date).format('MMM YYYY')).toString(); // x-coordinates
  this.graph_data = pricesArray.toString(); // y-coordinates
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
    .then(symbolSearchResults => {
      let symbol = symbolSearchResults.body.bestMatches[0]['1. symbol'];
      let name = symbolSearchResults.body.bestMatches[0]['2. name'];
      console.log('132 symbol:', symbol);
      console.log('133 name:', name);

      // Creates url for 2nd API request, using symbol from 1st request
      let urlTwo = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&outputsize=full&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;

      superagent.get(urlTwo) // Send 2nd API request to get the past stock values
        .then(priceData => {
          latestSavedRegretObj = new Regret(priceData.body, investment, name, symbol); // Run response through constructor model
        }) 
        .then(regret => {
          console.log('141 regret', regret)
          return response.render('pages/result', { regret: latestSavedRegretObj })
        })
    })
}

// TODO Callback to save regret object to SQL portfolio table
// Fires when user clicks "Save to my regrets" button
function saveRegret(request, response) {
  console.log('request.body in saveRegret()', request.body);

  let {symbol, name, search_date, search_date_price, past_price, past_date, investment, investment_worth, profit, graph_labels, graph_data} = request.body;

  let SQL = `INSERT INTO portfolio(symbol, name, search_date, search_date_price, past_price, past_date, investment, investment_worth, profit, graph_labels, graph_data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`;

  // TODO Create variable to hold values
  let values = [symbol, name, search_date, search_date_price, past_price, past_date, investment, investment_worth, profit, graph_labels, graph_data];

  return client.query(SQL, values)
    .then(response.redirect('/portfolio'))
    .catch(err => getError(err, response));
}

// TODO Callback that gets saved regrets from DB and renders on portfolio.ejs view
function getPortfolio(request, response) {
  let SQL = 'SELECT * FROM portfolio;';

  return client.query(SQL)
    .then(results => response.render('pages/portfolio', {results: results.rows}))
    .catch(getError);
}

// TODO Render "About Us" view
// function getAbout(request, response) {
//   response.render('pages/about');
//   app.use(express.static('./public'));
// }

function getError(request, response) {
  // console.error(request.body);
  response.render('pages/error');
  app.use(express.static('./public'));
}
