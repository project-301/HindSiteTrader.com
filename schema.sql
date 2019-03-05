DROP TABLE portfolio;

CREATE TABLE IF NOT EXISTS portfolio (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(25),
  name VARCHAR(50),
  past_price NUMERIC(8, 2),
  search_date_price NUMERIC(8, 2),
  investment NUMERIC(8,2),
  past_date VARCHAR(10),
  search_date VARCHAR(10),
);

CREATE TABLE IF NOT EXISTS graph_data (
  id SERIAL PRIMARY KEY,
  -- TODO Add coordinate x data
  -- TODO Add coordinate y data
  portfolio_id INTEGER NOT NULL,
  FOREIGN KEY (portfolio_id) REFERENCES portfolio (id)
);

INSERT INTO portfolio (symbol, name, ) VALUES ('AAPL', 'Apple Inc.', );