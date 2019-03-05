'use strict';

// **************************************************
// Configuration and Setup
// **************************************************

// Application dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

// Environment variables
require('dotenv').config();

// Application setup
const app = express();
const PORT = process.env.PORT || 2001;

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
// app.post('/search-result', getResults);



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

function Regret(data) {
  // Maps over 'Monthly Time Series' and creates an array of objects for each month in the format {date: "YYYY-MM-DD", price: ####.##}
  const monthlyStockPriceArray = Object.entries(data['Monthly Time Series']).map(entry => {
    return { date: entry[0], price: parseFloat(entry[1]['4. close']) };
  })

  this.symbol = data['Meta Data']['2. Symbol'];
  // this.name = ; // TODO: add name from search request

  this.search_date = convertDateToUnix(monthlyStockPriceArray[0].date);
  this.search_date_price = convertDateToUnix(monthlyStockPriceArray[0].price);

  this.past_date = convertDateToUnix(monthlyStockPriceArray.slice(-1)[0].date);
  this.past_date_price = convertDateToUnix(monthlyStockPriceArray.slice(-1)[0].price);

  // Call Graph Coordinates constructor?

}

// Takes date string "YYYY-MM-DD" and converts to unix timestamp
Regret.convertDateToUnix = function(dateString) {
  return new Date(dateString) / 1000;
}

// **************************************************
// Helper functions
// **************************************************

function getSearchForm(request, response) {
  response.render('index');
  app.use(express.static('./public'));
}

function getResults(request, response) {

  /*
  We need to first send a GET request to the AlphaVantage API with the user's company input (a string), and their response returns an array of companys matching that search (including the ticker symbols). 
  Here's an example GET request that searches for the string "microsoft":
  https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=microsoft&datatype=JSON&apikey=ALPHAVANTAGE_API_KEY
  */

  console.log('request body:', request.body);

  let url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${request.body.ticker}&outputsize=full&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;

  superagent.get(url)
    .then(apiRes => {
      if (apiRes.body) {
        return new Regret(apiRes.body);
      } else {
        response.render('pages/error');
        app.use(express.static('./public'));
      }
    })
    .then(results => response.render('pages/result', { company: results }))
    .catch('err', getError);

  //   response.render('pages/result');
  //   app.use(express.static('./public'));
  // }

  // function getPortfolio(request, response) {
  //   response.render('pages/portfolio');
  //   app.use(express.static('./public'));
  // }

  // function getAbout(request, response) {
  //   response.render('pages/about');
  //   app.use(express.static('./public'));
  // }
}

function getError(request, response) {
  console.error(request.body);
  response.render('pages/error');
  app.use(express.static('./public'));
}
