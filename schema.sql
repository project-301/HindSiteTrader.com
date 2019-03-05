DROP TABLE portfolio; -- Removed graph_data table

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
  investment NUMERIC(10,2), -- max investment is 99,999,999.99
  graph_labels TEXT, -- long string of MMM YYYY separated by commas
  graph_data TEXT -- long string of prices separated by commas
);

-- Probably won't use a second table and will just store data in single table
-- CREATE TABLE IF NOT EXISTS graph_data (
--   id SERIAL PRIMARY KEY,
--   -- TODO Add coordinate x data
--   -- TODO Add coordinate y data
--   portfolio_id INTEGER NOT NULL,
--   FOREIGN KEY (portfolio_id) REFERENCES portfolio (id)
-- );

-- INSERT INTO portfolio (symbol, name, search_date, search_date_price, past_price, past_date, investment, graph_labels, graph_data) VALUES ('AAPL', 'Apple Inc.', ) RETURNING id;
INSERT INTO portfolio (symbol, name, search_date, search_date_price, past_price, past_date, investment, graph_labels, graph_data) VALUES ('MSFT', 
'Microsoft Corporation', 
888537600, 
112.26, 
84.75, 
1551657600, 
1000, 
'Mar 2019,Feb 2019,Jan 2019,Dec 2018,Nov 2018,Oct 2018,Sep 2018,Aug 2018,Jul 2018,Jun 2018,May 2018,Apr 2018,Mar 2018,Feb 2018,Jan 2018,Dec 2017,Nov 2017,Oct 2017,Sep 2017,Aug 2017,Jul 2017,Jun 2017,May 2017,Apr 2017,Mar 2017,Feb 2017,Jan 2017,Dec 2016,Nov 2016,Oct 2016,Sep 2016,Aug 2016,Jul 2016,Jun 2016,May 2016,Apr 2016,Mar 2016,Feb 2016,Jan 2016,Dec 2015,Nov 2015,Oct 2015,Sep 2015,Aug 2015,Jul 2015,Jun 2015,May 2015,Apr 2015,Mar 2015,Feb 2015,Jan 2015,Dec 2014,Nov 2014,Oct 2014,Sep 2014,Aug 2014,Jul 2014,Jun 2014,May 2014,Apr 2014,Mar 2014,Feb 2014,Jan 2014,Dec 2013,Nov 2013,Oct 2013,Sep 2013,Aug 2013,Jul 2013,Jun 2013,May 2013,Apr 2013,Mar 2013,Feb 2013,Jan 2013,Dec 2012,Nov 2012,Oct 2012,Sep 2012,Aug 2012,Jul 2012,Jun 2012,May 2012,Apr 2012,Mar 2012,Feb 2012,Jan 2012,Dec 2011,Nov 2011,Oct 2011,Sep 2011,Aug 2011,Jul 2011,Jun 2011,May 2011,Apr 2011,Mar 2011,Feb 2011,Jan 2011,Dec 2010,Nov 2010,Oct 2010,Sep 2010,Aug 2010,Jul 2010,Jun 2010,May 2010,Apr 2010,Mar 2010,Feb 2010,Jan 2010,Dec 2009,Nov 2009,Oct 2009,Sep 2009,Aug 2009,Jul 2009,Jun 2009,May 2009,Apr 2009,Mar 2009,Feb 2009,Jan 2009,Dec 2008,Nov 2008,Oct 2008,Sep 2008,Aug 2008,Jul 2008,Jun 2008,May 2008,Apr 2008,Mar 2008,Feb 2008,Jan 2008,Dec 2007,Nov 2007,Oct 2007,Sep 2007,Aug 2007,Jul 2007,Jun 2007,May 2007,Apr 2007,Mar 2007,Feb 2007,Jan 2007,Dec 2006,Nov 2006,Oct 2006,Sep 2006,Aug 2006,Jul 2006,Jun 2006,May 2006,Apr 2006,Mar 2006,Feb 2006,Jan 2006,Dec 2005,Nov 2005,Oct 2005,Sep 2005,Aug 2005,Jul 2005,Jun 2005,May 2005,Apr 2005,Mar 2005,Feb 2005,Jan 2005,Dec 2004,Nov 2004,Oct 2004,Sep 2004,Aug 2004,Jul 2004,Jun 2004,May 2004,Apr 2004,Mar 2004,Feb 2004,Jan 2004,Dec 2003,Nov 2003,Oct 2003,Sep 2003,Aug 2003,Jul 2003,Jun 2003,May 2003,Apr 2003,Mar 2003,Feb 2003,Jan 2003,Dec 2002,Nov 2002,Oct 2002,Sep 2002,Aug 2002,Jul 2002,Jun 2002,May 2002,Apr 2002,Mar 2002,Feb 2002,Jan 2002,Dec 2001,Nov 2001,Oct 2001,Sep 2001,Aug 2001,Jul 2001,Jun 2001,May 2001,Apr 2001,Mar 2001,Feb 2001,Jan 2001,Dec 2000,Nov 2000,Oct 2000,Sep 2000,Aug 2000,Jul 2000,Jun 2000,May 2000,Apr 2000,Mar 2000,Feb 2000,Jan 2000,Dec 1999,Nov 1999,Oct 1999,Sep 1999,Aug 1999,Jul 1999,Jun 1999,May 1999,Apr 1999,Mar 1999,Feb 1999,Jan 1999,Dec 1998,Nov 1998,Oct 1998,Sep 1998,Aug 1998,Jul 1998,Jun 1998,May 1998,Apr 1998,Mar 1998,Feb 1998', 
'112.2600,112.0300,104.4300,101.5700,110.8900,106.8100,114.3700,112.3300,106.0800,98.6100,98.8400,93.5200,91.2700,93.7700,95.0100,85.5400,84.1700,83.1800,74.4900,74.7700,72.7000,68.9300,69.8400,68.4600,65.8600,63.9800,64.6500,62.1400,60.2600,59.9200,57.6000,57.4600,56.6800,51.1700,53.0000,49.8700,55.2300,50.8800,55.0900,55.4800,54.3500,52.6400,44.2600,43.5200,46.7000,44.1500,46.8600,48.6400,40.6550,43.8500,40.4000,46.4500,47.8100,46.9500,46.3600,45.4300,43.1600,41.7000,40.9400,40.4000,40.9900,38.3100,37.8400,37.4100,38.1300,35.4050,33.2800,33.4000,31.8400,34.5450,34.9000,33.1000,28.6050,27.8000,27.4500,26.7097,26.6150,28.5400,29.7600,30.8200,29.4700,30.5900,29.1900,32.0150,32.2550,31.7400,29.5300,25.9600,25.5800,26.6300,24.8900,26.6000,27.4000,26.0000,25.0100,25.9200,25.3900,26.5800,27.7250,27.9100,25.2575,26.6650,24.4900,23.4650,25.8100,23.0100,25.8000,30.5350,29.2875,28.6700,28.1800,30.4800,29.4100,27.7300,25.7200,24.6500,23.5200,23.7700,20.8900,20.2600,18.3700,16.1500,17.1000,19.4400,20.2200,22.3300,26.6900,27.2900,25.7200,27.5100,28.3200,28.5200,28.3800,27.1999,32.6000,35.6000,33.6000,36.8100,29.4600,28.7300,28.9900,29.4700,30.6901,29.9400,27.8700,28.1700,30.8600,29.8600,29.3600,28.7100,27.3500,25.7000,24.0600,23.3000,22.6500,24.1500,27.2100,26.8700,28.1500,26.1500,27.6800,25.7000,25.7300,27.3800,25.6100,24.8400,25.8000,25.3000,24.1700,25.1600,26.2800,26.7200,26.8100,27.9700,27.6500,27.3000,28.4900,28.5600,26.2300,26.1300,24.9300,26.5300,27.6500,27.3700,25.7100,26.1400,27.8000,26.5200,26.4100,25.6400,24.6100,25.5700,24.2100,23.7000,47.4600,51.7000,57.6800,53.4700,43.7400,49.0800,47.9800,54.7000,50.9100,52.2600,60.3100,58.3400,63.7100,66.2500,64.2100,58.1500,51.1700,57.0500,66.1900,73.0000,69.1800,67.7500,54.6900,59.0000,61.0600,43.3800,57.3800,68.8700,60.3100,69.8100,69.8100,80.0000,62.5600,69.7500,106.2500,89.3700,97.8700,116.7500,91.0500,92.5600,90.5600,92.5600,85.8100,90.1900,80.6900,81.3100,89.6200,150.1300,175.0000,138.6900,122.0000,105.8700,110.0600,95.9400,109.9400,108.3700,84.8100,90.1200,89.5000,84.7500') RETURNING id;