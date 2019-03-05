DROP TABLE portfolio, graph_data;

-- Per convo with Sam on Monday...
-- We should store graph coordinates inside of our portfolio table (no need for a second table)
-- We only need to store the prices (the y-axis), as the x-axis will always 5 equidistant points
-- (5 date points spaced apart evently, beginning with the past_date and ending with the search_date) 
-- To get the 

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

-- Probably won't use a second table and will just store data in single table
-- CREATE TABLE IF NOT EXISTS graph_data (
--   id SERIAL PRIMARY KEY,
--   -- TODO Add coordinate x data
--   -- TODO Add coordinate y data
--   portfolio_id INTEGER NOT NULL,
--   FOREIGN KEY (portfolio_id) REFERENCES portfolio (id)
-- );

INSERT INTO portfolio (symbol, name, ) VALUES ('AAPL', 'Apple Inc.', ) RETURNING id;
INSERT INTO portfolio (symbol, name, ) VALUES ('MSFT', 'Microsoft Corporation', ) RETURNING id;