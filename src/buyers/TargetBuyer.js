const configuration = require('../../buyerConfig.json')
const {clickAndWait,clickOnXPath,isXPathThere} = require('../pageHelpers')
const sendNotification = require('../discord')
module.exports =  async function buyAmazonIfInStock(page,maximumPrice,maximumQuantity,item) {
  
  

  let isAddToCart = await isXPathThere(page,'//button[@data-test="shipItButton"]')

  if(isAddToCart){
    await sendNotification(item.url,item.name)
    await pickHighestAmount(page,maximumQuantity)
    const isGoodPrice = await isPriceGood(page,maximumPrice)
    if(isGoodPrice && configuration.buyItems === true){
      await clickOnXPath(page,'//button[@data-test="shipItButton"]')
      if(isXPathThere(page,'//button[@data-test="addToCartErrorPopover"]')){
        page.goto('https://www.target.com/co-cart')
      }else{
        await isXPathThere(page,'//button[@data-test="addToCartModalViewCartCheckout"]')
        await clickOnXPath(page,'//button[@data-test="addToCartModalViewCartCheckout"]')
      }
      await page.waitForNavigation({ waitUntil: 'networkidle0' })
      await clickOnXPath(page,'//button[@data-test="checkout-button"]')

      await page.waitForNavigation({ waitUntil: 'networkidle0' })
      await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

      let isUsername = await isXPathThere(page,'//input[@name="username"]')
      if(isUsername){
          await logIntoTarget(page)
      }
      
      if(configuration.buyItems === true){
        await page.waitForNavigation({ waitUntil: ["networkidle0", "domcontentloaded"]})
        await clickOnXPath('//button[@data-test="placeOrderButton"]')
        return "bought"
      }
    }
  }

  return "not bought"


}
async function logIntoTarget(page){

  await page.focus('#username')
  await page.keyboard.type(configuration.target.targetUsername)  
  await page.focus('#password')
  await page.keyboard.type(configuration.target.targetPassword)  
  await page.click("#login")

}

async function pickHighestAmount(page,maximumQuantity){
  await clickOnXPath(page,'//button[@data-test="custom-quantity-picker"]')
  
  let purchaseLimit = await page.$$('[class^=OptionLabel-]')
  purchaseLimit = purchaseLimit.length
  if(maximumQuantity > purchaseLimit){
    await clickOnXPath(page,'//li/a/div/div[text()='+String(purchaseLimit)+']')
  }else{
    await clickOnXPath(page,'//li/a/div/div[text()='+String(maximumQuantity)+']')
  }

}
async function isPriceGood(page,maximumPrice){
    let priceElement = await page.$x('//div[@data-test="product-price"]')
    let priceObject = await priceElement[0].getProperty('innerText')
    let value = priceObject._remoteObject.value
    value = Number(value.replace(/[^0-9\.]+/g, ""))
    const goodPrice = (value <= maximumPrice)
    return goodPrice
}



