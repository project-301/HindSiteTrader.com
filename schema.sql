DROP TABLE portfolio;

-- Should store graph coordinates inside of our portfolio table (no need for a second table)
-- Only need to store the prices (the y-axis), as the x-axis will always be 5 equidistant points
-- (5 date points spaced apart evently, beginning with the past_date and ending with the search_date) 

CREATE TABLE IF NOT EXISTS portfolio (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(15),
  name VARCHAR(50),
  search_date VARCHAR(10), -- unix timestamp (so we can display/use in various ways)
  search_date_price NUMERIC(10, 2),
  cur_date VARCHAR(10), -- unix timestamp (so we can display/use in various ways)
  cur_price NUMERIC(10, 2),
  investment NUMERIC(10, 2), -- max investment is 99,999,999.99
  investment_worth NUMERIC(10, 2),
  profit NUMERIC(10, 2),
  graph_labels TEXT, -- long string of MMM YYYY separated by commas
  graph_data TEXT -- long string of prices separated by commas
);
