DROP TABLE portfolio;

-- Per convo with Sam on Monday...
-- We should store graph coordinates inside of our portfolio table (no need for a second table)
-- We only need to store the prices (the y-axis), as the x-axis will always 5 equidistant points
-- (5 date points spaced apart evently, beginning with the past_date and ending with the search_date) 
-- To get the 

CREATE TABLE IF NOT EXISTS portfolio (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(15),
  name VARCHAR(50),
  search_date INTEGER NOT NULL, -- unix timestamp (so we can display/use in various ways)
  search_date_price NUMERIC(10, 2),
  past_price NUMERIC(10, 2),
  past_date INTEGER NOT NULL, -- unix timestamp (so we can display/use in various ways)
  investment NUMERIC(10, 2), -- max investment is 99,999,999.99
  investment_worth NUMERIC(10, 2),
  profit NUMERIC(10, 2),
  graph_labels TEXT, -- long string of MMM YYYY separated by commas
  graph_data TEXT -- long string of prices separated by commas
);
