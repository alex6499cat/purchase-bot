const configuration = require('../../buyerConfig.json')
const {clickAndWait,clickOnXPath,isXPathThere} = require('../pageHelpers')
const sendNotification = require('../discord')
module.exports =  async function buyAmazonIfInStock(page,maximumPrice,maximumQuantity,item) {

  let isAddToCart = await isXPathThere(page,'//button[@class="btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button"]')

  if(isAddToCart === true){
    let price = await getPrice(page)
    await sendNotification(item.url,item.name)
    if(price < maximumPrice && configuration.buyItems === true){

        await clickOnXPath(page,'//button[@class="btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button"]')

        await clickOnXPath(page,'//div[@class="go-to-cart-button"]//a')

        await pickHighestAmount(page,maximumQuantity)
        let checkout = await isXPathThere(page,"//div[@class='checkout-buttons__checkout']//button")
        if(checkout){
          await clickOnXPath(page,"//div[@class='checkout-buttons__checkout']//button")
        }
        checkout = await isXPathThere(page,"//div[@class='checkout-buttons__checkout']//button")
        if(checkout){
          await clickOnXPath(page,"//div[@class='checkout-buttons__checkout']//button")
        }
        await page.waitForNavigation({ waitUntil: 'networkidle0' })
        const loginPage = await page.$('#fld-e').catch();
      if(loginPage){
        await logIntoBestBuy(page)
      }
      await enterSecurityCode(page)
      if(configuration.buyItems === true){
        await clickOnXPath('//button[@class="btn btn-lg btn-block btn-primary button__fast-track"]')
      }
      return "bought"
    }
      
    
  }
  return "not bought"


}
async function logIntoBestBuy(page){
  await page.focus('#fld-e')
  await page.keyboard.type(configuration.bestbuy.bestbuyUsername)  
  await page.focus('#fld-p1')
  await page.keyboard.type(configuration.bestbuy.bestbuyPassword)  
  await clickOnXPath(page,"//button[text()='Sign In']")
  await page.waitForNavigation({ waitUntil: 'networkidle0' })
}
async function enterSecurityCode(page){
  await page.focus('#credit-card-cvv')
  await page.keyboard.type(configuration.bestbuy.defaultPaymentSecurityCode)  
}
async function pickHighestAmount(page,maximumQuantity){
  await clickOnXPath(page,'//div[@class="c-dropdown-wrapper"]')
  
  let purchaseLimit = await page.$x('//select[@class="c-dropdown v-medium fluid-item__quantity"]//option')
  purchaseLimit = purchaseLimit.length

  if(maximumQuantity > purchaseLimit){
    await page.select("[class='c-dropdown v-medium fluid-item__quantity'", String(purchaseLimit + 1))
  }else{
     await page.select("[class='c-dropdown v-medium fluid-item__quantity'", String(maximumQuantity))
  }

}
async function getPrice(page){
    let priceElement = await page.$x('//div[@class="priceView-hero-price priceView-customer-price"]//span[@aria-hidden="true"]')
    let priceObject = await priceElement[0].getProperty('innerText')
    let value = priceObject._remoteObject.value
    value = Number(value.replace(/[^0-9\.]+/g, ""))
    return value
}



