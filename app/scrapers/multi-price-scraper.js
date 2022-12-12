

exports.multiPriceScraper = async(browser, company) => {
    console.log("We did it inside multiprice scraper", company)
    let page = await browser.newPage();
    let response = {
        productsBought: 0,
        productsNotBought: 0
    }
    if(company.company === "Target") {
        let url;
        for(let i = 0; i < company.productIds.length; i++) {
            await generateTargetUrlAndGoTo(company.productIds[i])
            await checkTargetStockAndAddToCart(company, i)
            response.productsBought++
        }
        await page.goto("http://target.com/cart")

		await page.waitForSelector('div[data-test="cart-summary-total"]')

		let total = await page.$eval('div[data-test="cart-summary-total"] p', el => el.innerText )
        if(total) {
            console.log("total", total)
            response.total = total
            return response
        } else {
            return "Invalid query."
        }
    } else if(company.company === "Amazon") {
        let url;
        for(let i = 0; i < company.productIds.length; i++) {
            await generateAmazonUrlAndGoTo(company.productIds[i])
            await checkAmazonStockAndAddToCart()
            response.productsBought++
        }
        await loginToAmazon()
        
        await page.waitForSelector(".grand-total-price")
        let total = await page.$eval(".grand-total-price", el => el.innerText)
        if(total) {
            console.log(total)
            response.total= total
            return response
        } else {
            return "Invalid query."
        }
    }
    async function generateTargetUrlAndGoTo(product) {
        url = `http://target.com/p/${product}`
        console.log(`Navigating to ${url}...`);
        await page.goto(url)
    
        await page.waitForSelector('button[data-test="fulfillment-cell-shipping"]')
    
        await page.click('button[data-test="fulfillment-cell-shipping"]');
    }
    async function checkTargetStockAndAddToCart(company, i) {
        let inStock = await page.$eval('div[data-test="@web/AddToCart/Fulfillment/ShippingSection"] h3 span', el => el.innerText)
        let slicedInStock = inStock.slice(0, 7)
        console.log("what about here?")
        if(slicedInStock != "Ship to") {
            console.log("Item not available to ship")
            response[company.company].productsNotBought++
        }
        slicedProductId = company.productIds[i].slice(2)
        await page.waitForSelector(`#addToCartButtonOrTextIdFor${slicedProductId}`)

        await page.click(`#addToCartButtonOrTextIdFor${slicedProductId}`)
    }
    async function generateAmazonUrlAndGoTo(product) {
        url = `http://amazon.com/dp/${product}`
			console.log(`Navigating to ${url}...`);
			await page.goto(url);
    }
    async function checkAmazonStockAndAddToCart() {
        await page.waitForSelector('#a-page');
            console.log("inside in stock")
            await page.waitForSelector("#add-to-cart-button")
            await page.click("#add-to-cart-button")
            await page.waitForSelector('#sc-buy-box-ptc-button')
    }
    async function loginToAmazon() {
        await page.waitForSelector('#sc-buy-box-ptc-button')
		await page.click("#sc-buy-box-ptc-button span input")
        await page.waitForSelector("#ap_email")
        await page.$eval('#ap_email', el => el.value = 'testingamazon123456789@gmail.com');
        await page.click("#continue")
        
        await page.waitForSelector("#ap_password")
        await page.$eval('#ap_password', el => el.value = "catdog34")
        await page.click("#signInSubmit")
    }
}

