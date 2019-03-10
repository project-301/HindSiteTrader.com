# HindSite Trader

*a stock market time machine by:*
*[Billy Bunn](https://github.com/BillyBunn), [Harrison Cogswell](https://github.com/HCoggers), [Andrew Curtis](https://github.com/amjcurtis), and [Liz Kavalski](https://github.com/lizkavalski)*

*URL: [hindsite.trade](http://hindsite.trade)*

*Version: 1.0.0*

## Overview

HindSite Trader is a website that lets you look back in time and see what your investment would be worth if you had invested in any publicly traded company in the U.S. at a given point in time. You can also save your searches and come back to them later to cry over your poor investment choices. Our site was built as a mobile-first web app that follows responsive design principles. 

## Architecture

For this project we used the following technologies: 

* **Languages:** JavaScript, SQL
* **Libraries and frameworks:** Node.js, Express, jQuery, Chart.js, Moment.js
* **Required packages:** dotenv, ejs, express, method-override, moment, pg, superagent
* **Database:** PostgreSQL
* **Deployment platform:** Heroku
* **APIs:** [Alpha Vantage](https://www.alphavantage.co/)

## Getting Started

You can run our app locally following these steps: 

* Install Node.js
* If you're on a Mac, you'll need to install [Homebrew](https://brew.sh)
* Clone this GitHub repo
* Run `npm i` within the repo's root directory to install our app dependencies
* Install Nodemon globally with `npm i -g nodemon`
* Install [PostgreSQL](https://www.postgresql.org/download)
* Create a `.env` file to store your local environment variables
* Run PostgreSQL
** `sudo service postgresql start` on Windows/WSL or Linux
** `brew services start postgresq` on Mac
* Create a local database: `psql CREATE DATABASE <database_name>`
* Add our SQL schema to your database: `psql -f schema.sql -d <database_name>`
* Get your own API key from [Alpha Vantage](https://www.alphavantage.co/) and add it to your `.env` file
* Add your PostgreSQL database URL to your `.env` file
* Run Nodemon from within the root directory of the cloned repo
* Open `localhost:3000` in your browser

## Sample Responses from API

### Symbol Search Endpoint

Gets company info based on user search input. Alpha Vantage documentation on this API endpoint is [here](https://www.alphavantage.co/documentation/#symbolsearch). 

```
{
    "Meta Data": {
        "1. Information": "Daily Time Series with Splits and Dividend Events",
        "2. Symbol": "AAPL",
        "3. Last Refreshed": "2019-03-06 12:57:53",
        "4. Output Size": "Full size",
        "5. Time Zone": "US/Eastern"
    },
    "Time Series (Daily)": {
        "2019-03-06": {
            "1. open": "174.6700",
            "2. high": "175.4900",
            "3. low": "173.9400",
            "4. close": "174.7000",
            "5. adjusted close": "174.7000",
            "6. volume": "10789704",
            "7. dividend amount": "0.0000",
            "8. split coefficient": "1.0000"
        },
        "2019-03-05": {
            "1. open": "175.9400",
            "2. high": "176.0000",
            "3. low": "174.5400",
            "4. close": "175.5300",
            "5. adjusted close": "175.5300",
            "6. volume": "19737419",
            "7. dividend amount": "0.0000",
            "8. split coefficient": "1.0000"
        }
    }
}    
```

### Daily Adjusted Stock Time Series Endpoint 

Alpha Vantage documentation on this API endpoint is [here](https://www.alphavantage.co/documentation/#dailyadj).

```
{
    "Meta Data": {
        "1. Information": "Daily Time Series with Splits and Dividend Events",
        "2. Symbol": "MSFT",
        "3. Last Refreshed": "2019-03-08",
        "4. Output Size": "Compact",
        "5. Time Zone": "US/Eastern"
    },
    "Time Series (Daily)": {
        "2019-03-08": {
            "1. open": "109.1600",
            "2. high": "110.7100",
            "3. low": "108.8000",
            "4. close": "110.5100",
            "5. adjusted close": "110.5100",
            "6. volume": "22818430",
            "7. dividend amount": "0.0000",
            "8. split coefficient": "1.0000"
        },
        "2019-03-07": {
            "1. open": "111.4000",
            "2. high": "111.5500",
            "3. low": "109.8650",
            "4. close": "110.3900",
            "5. adjusted close": "110.3900",
            "6. volume": "25338954",
            "7. dividend amount": "0.0000",
            "8. split coefficient": "1.0000"
        }
    }
}
```

## Change Log

`03-04-2019` Planned features and app page flow, designed wireframes, whiteboarded out app views and DOM trees. Built out repo structure and file scaffolding. Deployed app to Heroku for basic proof of life.

`03-05-2019` Added dummy JSON data for modeling and testing SQL schema. Added basic styling.

`03-06-2019` Implemented styling across all app pages. Replaced dummy JSON data with real API responses. "The Great Stock Split Fix of 2019."

`03-07-2019` Finish database integration and functionality for displaying individual charts for saved searches. Finalized styling.

`03-08-2019` Added form validation and app documentation. Hotfix for Alpha Vantage API's search endpoint being down; allows user to search using ticker symbols instead of company names. 

`03-09-2019` Restored first API call, users can search any company name again; Alpha Vantage API's search endpoint has been fixed.
