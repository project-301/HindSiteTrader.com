'use strict';

// **************************************************
// Configuration and Setup
// **************************************************

// Application dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const moment = require('moment'); // moment.js is a library that helps with formatting our dates for the line graph
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



// Portfolio route
// When user clicks on portfolio icon in header, renders portfolio view (/views/pages/portfolio.ejs)
// app.get('/portfolio', getPortfolio);

// About route
// When user clicks on "About" link in footer, renders "about us" view (/views/pages/about.ejs)
// app.get('/about', getAbout)

// Error route / catch-all route
// When user navigates to any url other than the routes above, renders the error view (/views/pages/error.ejs)
app.get('*', getError);

// Make sure server is listening for requests ("flips the switch" to turn the server "on")
app.listen(PORT, () => console.log(`listening on port: ${PORT}`));

// **************************************************
// Models
// **************************************************

function Regret(data, name, symbol) {
  // Maps over 'Monthly Time Series' and creates an array of objects for each month in the format {date: "YYYY-MM-DD", price: ####.##}

  const datesArray = Object.keys(data['Monthly Time Series']);
  const pricesArray = Object.entries(data['Monthly Time Series']).map(value => value[1]['4. close'])

  this.symbol = symbol;
  this.name = name; // TODO: add name from search request

  this.search_date = datesArray[0];
  this.search_date_price = pricesArray[0];

  this.past_date = datesArray.slice(-1)[0];
  this.past_price = pricesArray.slice(-1)[0];
  this.investment = 1000; // need to edit here.

  // Graph data. (possibly the place to use Moment.js for date formatting from unix timestamps)
  this.graph_labels = datesArray.map(date => moment(date).format("MMM YYYY")).toString(); // "labels" is an array containing the x-axis coordinates for our chart.js line graph; so it's an array of dates in the format MMM YYYY.
  this.graph_data = pricesArray.toString(); // "data" is an array containing the y-axis coordinates for our chart.js line graph; so it's an array of stock prices. Should be EXACTLY the same length as graph_labels in order for our chart to render correctly.

}

// Takes date string "YYYY-MM-DD" and converts to unix timestamp
// Regret.convertDateToUnix = function(dateString) {
//   return new Date(dateString) / 1000;
// }

// **************************************************
// Helper functions
// **************************************************

function getSearchForm(request, response) {
  response.render('index');
  app.use(express.static('./public'));
}

function getResults(request, response) {
  console.log('fired getResults()');
  // console.log('127 client request.body:', request.body);
  // console.log('128 client request.body.search[1]:', request.body.search[1]);

  let url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${request.body.search[1]}&outputsize=full&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;

  superagent.get(url)
    .then(apiResponse => {
      let symbol = apiResponse.body.bestMatches[0]['1. symbol'];
      let name = apiResponse.body.bestMatches[0]['2. name'];
      console.log('138 symbol:', symbol);
      console.log('149 name:', name);
      let urlTwo = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&outputsize=full&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;

      superagent.get(urlTwo)
        .then(apiResponseTwo => new Regret(apiResponseTwo.body, name, symbol))
        .then(regret => {
          console.log('137 regret', regret)
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
