'use strict';

// **************************************************
// Configuration and Setup
// **************************************************

// Application dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');
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

// Middleware to handle PUT and DELETE
// Modelled on demo code in seattle-301d44/13-update-delete/demos/todo-app/server.js:
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    // look in urlencoded POST bodies and delete it
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))

// Database setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log('44 error', err));

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

// When user clicks on portfolio icon in header (OR clicks "Save to my regrets" button?), render portfolio view (/views/pages/portfolio.ejs)
app.get('/portfolio', getPortfolio);

// Route for serving up graph data for portfolio details
app.get('/portfolio-graph/:regret_id', getGraphData);

// Route for deleting a regret
app.get('/delete/:regret_id', deleteRegret);

// About Us route
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

// Object that includes arrays of chart data to be passed to client-side app.js 
// Gets reset each time a Regret instance is constructed
let latestSavedRegretObj = {};

function Regret(apiPriceData, investment, name, symbol, userDate) {
  const datesArray = getSimplifiedData(apiPriceData, userDate).map(monthData => monthData['date']);
  const pricesArray = getSimplifiedData(apiPriceData, userDate).map(monthData => parseFloat(monthData['adjPrice'].toFixed(2)));

  this.symbol = symbol;
  this.name = name;
  this.search_date = datesArray[0];
  this.search_date_price = pricesArray[0];
  this.current_date = datesArray.slice(-1)[0];
  this.current_price = pricesArray.slice(-1)[0];
  this.investment = investment;
  this.investment_worth = (this.investment / this.search_date_price) * this.current_price;
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
      // console.log('symbolSearchResults.body:', symbolSearchResults.body);
      let symbol = symbolSearchResults.body.bestMatches[0]['1. symbol'];
      let name = symbolSearchResults.body.bestMatches[0]['2. name'];
      console.log('140 symbol:', symbol);
      console.log('141 name:', name);

      // Creates url for 2nd API request, using symbol from 1st request
      let urlTwo = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;

      superagent.get(urlTwo) // Send 2nd API request to get the past stock values
        .then(priceData => {
          latestSavedRegretObj = new Regret(priceData.body, investment, name, symbol, request.body.search[2]); // Run response through constructor model
        })
        .then(regret => {
          // console.log('151 latestSavedRegretObj', latestSavedRegretObj)
          return response.render('pages/result', { regret: latestSavedRegretObj })
        })
    })
}

// TODO Callback to save regret object to SQL portfolio table
// Fires when user clicks "Save to my regrets" button
function saveRegret(request, response) {
  console.log('saveRegret() function entered');
  // console.log('161 latestSavedRegretObj:', latestSavedRegretObj);

  let { symbol, name, search_date, search_date_price, current_price, current_date, investment, investment_worth, profit, graph_labels, graph_data } = latestSavedRegretObj;

  let SQL = 'INSERT INTO portfolio(symbol, name, search_date, search_date_price, cur_price, cur_date, investment, investment_worth, profit, graph_labels, graph_data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);';
  console.log('166 SQL:', SQL);

  // TODO Create variable to hold values
  let values = [symbol, name, search_date, search_date_price, current_price, current_date, investment, investment_worth, profit, graph_labels, graph_data];
  console.log('169 values:', values);
 
  return client.query(SQL, values)
    .then(() => response.redirect('/portfolio'))
    // console.log('173:', result);
    // })
    .catch(error => {
      console.log('180 error caught');
      request.error = error;
      getError(request, response)
    });
}

// TODO Callback that gets saved regrets from DB and renders on portfolio.ejs view
function getPortfolio(request, response) {
  console.log('getPortfolio function entered')
  let SQL = 'SELECT * FROM portfolio;'; // NEED to filter out some columns for rendering?

  return client.query(SQL)
    .then(result => {
      // console.log('185 results:', result.rows)
      response.render('pages/portfolio', { regret: result.rows })
    })
    .catch(error => {
      console.log('193 error caught');
      request.error = error;
      getError(request, response);
    });
}

// TODO Function to delete a saved regret from portfolio
function deleteRegret(request, response) {
  console.log('deleteRegret function entered');

  // TODO Need to create variable that's assigned id from request.body ?

  let SQL = `DELETE FROM portfolio WHERE id=$1;`;
  let values = [request.params.regret_id];

  client.query(SQL, values) // NEED to return this or not?
    .then(response.redirect('/portfolio')) // OR re-render? ALSO, verify this route?
    .catch(error => {
      console.log('216 error caught');
      request.error = error;
      getError(request, response);
    });
}

// TODO Render "About Us" view
// function getAbout(request, response) {
//   response.render('pages/about');
//   app.use(express.static('./public'));
// }

// Function to go through daily stock data from API, account for any stock split events, and return a simplified array for the close of each month
function getSimplifiedData(json, userDate) {
  let splitCo = 1;

  let simplifiedArray = Object.entries(json['Time Series (Daily)']).map(value => {
    let newObj = { date: value[0], price: value[1]['4. close'], split: value[1]['8. split coefficient'] };
    return newObj;
  }).reverse();

  let splitAdjDailyPricesArray = simplifiedArray.map(value => {
    splitCo *= parseFloat(value['split'])
    let adjPrice = parseFloat(value['price']) * splitCo;
    return { date: value['date'], originalPrice: value['price'], splitCo: splitCo, adjPrice: adjPrice }
  })

  let month = '';
  let filterMonthly = splitAdjDailyPricesArray.filter((day, idx) => {
    if (idx < splitAdjDailyPricesArray.length - 1) {
      month = splitAdjDailyPricesArray[idx + 1]['date'].slice(0, 7);
    } else {
      return true;
    }
    if (day['date'].slice(0, 7) !== month && day['date'].slice(0, 7) >= userDate) {
      return true;
    } else {
      return false;
    }
  })

  return filterMonthly;
}


function getGraphData(request, response) {
  console.log('Fired getGraphData');

  let SQL = `SELECT graph_labels, graph_data FROM portfolio WHERE id=$1;`;
  let values = [request.params.regret_id];

  return client.query(SQL, values)
    .then(result => {
      console.log('290 result.rows[0]', result.rows[0])
      response.send({data: result.rows[0].graph_data, labels: result.rows[0].graph_labels})
    })
    .catch(error => {
      console.log('294 error caught');
      request.error = error;
      getError(request, response);
    });


}


function getError(request, response) {
  console.error('From error handler: request.error', request.error);
  response.render('pages/error');
}
