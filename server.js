'use strict';

// Application Dependencies
const express = require('express');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 2001;

app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.get('/', getSearchForm);
app.get('*', (request, response) => response.render('index.ejs'));

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));

function getSearchForm(request, response) {
  response.render('index.ejs');
  app.use(express.static('./public'));
}