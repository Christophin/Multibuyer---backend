const pageScraper = require('../scrapers/single-price-scraper');
async function scrapeAll(browserInstance, company, productId){
	let browser;
	console.log("inside scrapper", company, productId)
	try{
		browser = await browserInstance;
		await pageScraper.scraper(browser, productId, company);
		// "Target" : "A-79283840", no ship: "A-14871912", A-78825535
		// "Amazon" : "1982185821", no stock: "B07HHYZLRV", must select size: B0014C0LSY
		// addd out of stock and price and tax sepreate.

		// take a list of items, return items bought, totals, and items not bought.
		
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = (browserInstance, company, productId) => scrapeAll(browserInstance, company, productId)