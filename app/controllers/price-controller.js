const browserObject = require('../../browser');
const pageScraper = require('../scrapers/single-price-scraper');
const multiPageScraper = require('../scrapers/multi-price-scraper')

exports.getPrice = async(req, res) => {
    console.log("we did it", req.body, req.body.company, req.body.productId)
    let browserInstance = browserObject.startBrowser();
    let browser;
	try{
		browser = await browserInstance;
		let scrape = await pageScraper.scraper(browser, req.body.productId, req.body.company);
		// "Target" : "A-79283840", no ship: "A-14871912", A-78825535, A-54191097
		// "Amazon" : "1982185821", no stock: "B07HHYZLRV", must select size: B0014C0LSY
		// addd out of stock and price and tax sepreate.
        if(scrape) {
            res.status(200).json(scrape)
        }
		
		
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

exports.getMultiPrice = async(req, res) => {
    console.log("we did it!", req.body)
    let browserInstance = browserObject.startBrowser();
    let browser;
    let response = {}
    // take a list of items, return items bought, totals, and items not bought.
    for(let i = 0; i < req.body.companies.length; i++) {
        let company = req.body.companies[i]
        console.log("inside for loop", company, company.company)
        try{
            browser = await browserInstance;
            let scrape = await multiPageScraper.multiPriceScraper(browser, company)
            if(scrape) {
                response[company.company] = scrape
            } else {
                response[company.company]
            }
        } catch(err) {
            console.log("Error in multiprice", err)
        }
    }
    if(response) {
        res.status(200).json(response)
    } else {
        res.status(500).json("invalid query")
    }
}