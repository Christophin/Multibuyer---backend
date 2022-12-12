const browserObject = require('./browser');
const scraperController = require('./app/controllers/pageController');

//Start the browser and create a browser instance
 let browserInstance = browserObject.startBrowser();

// Pass the browser instance to the scraper controller
 scraperController(browserInstance)

// var http = require('http');

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World!');
// }).listen(8080);