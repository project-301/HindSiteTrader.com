'use strict';

// DOM access variables
var canvasEl = document.getElementById('chart').getContext('2d');


// RENDERS CHART
function drawChart() {
  console.log('ran drawChart()');
  // updateChartArrays();
  var resultsChart = new Chart(canvasEl, {
    type: 'line',
    data: {
      labels: 'Mar 2019,Feb 2019,Jan 2019,Dec 2018,Nov 2018,Oct 2018,Sep 2018,Aug 2018,Jul 2018,Jun 2018,May 2018,Apr 2018,Mar 2018,Feb 2018,Jan 2018,Dec 2017,Nov 2017,Oct 2017,Sep 2017,Aug 2017,Jul 2017,Jun 2017,May 2017,Apr 2017,Mar 2017,Feb 2017,Jan 2017,Dec 2016,Nov 2016,Oct 2016,Sep 2016,Aug 2016,Jul 2016,Jun 2016,May 2016,Apr 2016,Mar 2016,Feb 2016,Jan 2016,Dec 2015,Nov 2015,Oct 2015,Sep 2015,Aug 2015,Jul 2015,Jun 2015,May 2015,Apr 2015,Mar 2015,Feb 2015,Jan 2015,Dec 2014,Nov 2014,Oct 2014,Sep 2014,Aug 2014,Jul 2014,Jun 2014,May 2014,Apr 2014,Mar 2014,Feb 2014,Jan 2014,Dec 2013,Nov 2013,Oct 2013,Sep 2013,Aug 2013,Jul 2013,Jun 2013,May 2013,Apr 2013,Mar 2013,Feb 2013,Jan 2013,Dec 2012,Nov 2012,Oct 2012,Sep 2012,Aug 2012,Jul 2012,Jun 2012,May 2012,Apr 2012,Mar 2012,Feb 2012,Jan 2012,Dec 2011,Nov 2011,Oct 2011,Sep 2011,Aug 2011,Jul 2011,Jun 2011,May 2011,Apr 2011,Mar 2011,Feb 2011,Jan 2011,Dec 2010,Nov 2010,Oct 2010,Sep 2010,Aug 2010,Jul 2010,Jun 2010,May 2010,Apr 2010,Mar 2010,Feb 2010,Jan 2010,Dec 2009,Nov 2009,Oct 2009,Sep 2009,Aug 2009,Jul 2009,Jun 2009,May 2009,Apr 2009,Mar 2009,Feb 2009,Jan 2009,Dec 2008,Nov 2008,Oct 2008,Sep 2008,Aug 2008,Jul 2008,Jun 2008,May 2008,Apr 2008,Mar 2008,Feb 2008,Jan 2008,Dec 2007,Nov 2007,Oct 2007,Sep 2007,Aug 2007,Jul 2007,Jun 2007,May 2007,Apr 2007,Mar 2007,Feb 2007,Jan 2007,Dec 2006,Nov 2006,Oct 2006,Sep 2006,Aug 2006,Jul 2006,Jun 2006,May 2006,Apr 2006,Mar 2006,Feb 2006,Jan 2006,Dec 2005,Nov 2005,Oct 2005,Sep 2005,Aug 2005,Jul 2005,Jun 2005,May 2005,Apr 2005,Mar 2005,Feb 2005,Jan 2005,Dec 2004,Nov 2004,Oct 2004,Sep 2004,Aug 2004,Jul 2004,Jun 2004,May 2004,Apr 2004,Mar 2004,Feb 2004,Jan 2004,Dec 2003,Nov 2003,Oct 2003,Sep 2003,Aug 2003,Jul 2003,Jun 2003,May 2003,Apr 2003,Mar 2003,Feb 2003,Jan 2003,Dec 2002,Nov 2002,Oct 2002,Sep 2002,Aug 2002,Jul 2002,Jun 2002'.split(',').reverse(), // (Populating this with dummy data for now)
      datasets: [{
        label: '$ Value',
        data: '354.3000,358.1000,339.5000,267.6600,286.1300,301.7800,374.1300,367.6800,337.4500,391.4300,351.6000,312.4600,295.3500,291.3800,270.3000,191.9600,187.5800,196.4300,181.3500,174.7100,181.6600,149.4100,163.0700,152.2000,147.8100,142.1300,140.7100,123.8000,117.0000,124.8700,98.5500,97.4500,91.2500,91.4800,102.5700,90.0300,102.2300,93.4100,91.8400,114.3800,123.3300,108.3800,103.2600,115.0300,114.3100,656.9400,624.0600,556.5000,416.6900,474.9100,441.8000,341.6100,346.5900,392.7700,451.1800,477.6400,422.7200,440.6000,417.8300,322.0400,352.0300,445.6300,409.3300,368.1700,365.8000,322.4800,309.2100,283.9100,244.4840,211.0900,226.2500,216.0700,189.2800,188.0800,165.2400,92.5900,81.7100,79.2394,54.4400,59.7200,56.8500,68.4850,63.4400,80.1400,115.0400,110.7300,120.2000,69.2900,64.5300,82.0800,113.2700,235.0100,265.9900,262.6900,270.8000,232.6700,237.7800,206.6700,214.0800,175.7000,205.9000,173.5700,162.1600,125.5200,102.5500,108.6500,111.1500,98.9000,73.7400,66.0500,62.2500,55.0900,58.6300,53.4500,46.1700,43.6300,43.9400,41.3400,39.4200,45.3100,42.9200,36.2400,36.1400,29.8900,22.9800,24.7600,30.8800,30.8400,30.8900,26.0700,30.3600,31.9800,34.6500,31.5800,25.1500,26.6200,23.1000,26.4700,20.7499,17.5200,17.2300,19.3900,21.8999,22.1700,23.1900,22.5300,22.8100,25.8600,29.2800,27.6600,22.7800,20.0200,20.6900,27.2100,27.6900,29.6400,28.9900,26.8100,27.5500,27.0600,27.5400,26.4100,25.9900,21.5600,18.5600,16.4100,14.2900,11.5500,10.8500,10.7000,11.5000,12.3300,11.3800,9.4700,15.4200,13.9500,20.5000,36.0000,32.9200,25.3600,34.1200,34.4000,73.4100,54.6900,49.0000,57.2200,33.5600,33.3300,26.2000,25.5500,22.4500,22.8000,20.3500,17.1100,13.2000,11.0100,10.8500,8.9710,9.7000,13.1100,13.3500,13.9900'.split(',').reverse(), // (Populating this with dummy data for now)
        backgroundColor: '#fff27f',
        borderColor: '#5c1fac'
      }]
    },
    options: {
      legend: {
        display: false
      },
      elements: {
        point: {
          radius: 0
        }
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: true,
            color: "#ab7de7"
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Value'
          },
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: true,
            color: "#ab7de7"
          }
        }]
      }
    }
  });
}

drawChart();
