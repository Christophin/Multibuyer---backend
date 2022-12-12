const scraperObject = {
    url: '',
    async scraper(browser, productId, retailer){
        let page = await browser.newPage();
		console.log("inside pageScraper", productId, retailer)
		// all target product ids begin with "A-", amazons have no dashes.
		if(retailer === "Target") {
			await generateTargetUrlAndGoTo(productId)
			await selectTargetShipping()
			await checkTargetStockAndAddToCart(productId)

			await page.goto("http://target.com/cart")

			await page.waitForSelector('div[data-test="cart-summary-total"]')

			let total = await page.$eval('div[data-test="cart-summary-total"] p', el => el.innerText )
			if(total) {
				console.log(total)
				return total
			} else {
				return "Invalid query."
			}
		
		} else if(retailer === "Amazon") {
			await generateAmazonUrlAndGoTo(productId)
			await addToAmazonCart()
			await loginToAmazon()
			
			await page.waitForSelector(".grand-total-price")
			let total = await page.$eval(".grand-total-price", el => el.innerText)
			if(total) {
				console.log(total)
				return total
			} else {
				return "Invalid query."
			}
		}
		async function generateTargetUrlAndGoTo(productId) {
			this.url = `http://target.com/p/${productId}`
			console.log(`Navigating to ${this.url}...`);
			await page.goto(this.url)
		}
		async function selectTargetShipping() {
			await page.waitForSelector('button[data-test="fulfillment-cell-shipping"]')

			await page.click('button[data-test="fulfillment-cell-shipping"]');
		}
		async function checkTargetStockAndAddToCart(productId) {
			let inStock = await page.$eval('div[data-test="@web/AddToCart/Fulfillment/ShippingSection"] h3 span', el => el.innerText)
			let slicedInStock = inStock.slice(0, 7)
			if(slicedInStock != "Ship to") {
				console.log("Item not available to ship")
				return "Item not available to ship"
			}

			slicedProductId = productId.slice(2)
			await page.waitForSelector(`#addToCartButtonOrTextIdFor${slicedProductId}`)

			await page.click(`#addToCartButtonOrTextIdFor${slicedProductId}`)
		}
		async function generateAmazonUrlAndGoTo(productId) {
			this.url = `http://amazon.com/dp/${productId}`
			console.log(`Navigating to ${this.url}...`);
			await page.goto(this.url);
		}
		async function addToAmazonCart() {
			await page.waitForSelector('#a-page');

			await page.waitForSelector("#add-to-cart-button")
			await page.click("#add-to-cart-button")
		}
		async function loginToAmazon() {
			await page.waitForSelector('#sc-buy-box-ptc-button')
			await page.click("#sc-buy-box-ptc-button span input")
			
			// testingamazon123456789@gmail.com
			// catdog34
			
			await page.waitForSelector("#ap_email")
			await page.$eval('#ap_email', el => el.value = 'testingamazon123456789@gmail.com');
			await page.click("#continue")
			
			await page.waitForSelector("#ap_password")
			await page.$eval('#ap_password', el => el.value = "catdog34")
			await page.click("#signInSubmit")
		}
    }
}
// async function doThing() {
// 	await page.click(`#addToCartButtonOrTextIdFor${slicedProductId}`)

// 	await page.goto("http://target.com/cart")

// 	await page.waitForSelector('div[data-test="cart-summary-total"]')
// }

module.exports = scraperObject;
