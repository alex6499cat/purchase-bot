const configuration = require('../../buyerConfig.json')
const pageHelpers = require('../pageHelpers')
const sendNotification = require('../discord')
module.exports =  async function buyAmazonIfInStock(page,maximumPrice,maximumQuantity,item) {
  
  
  const buyNow = await page.$('#buy-now-button').catch();
  
  if(buyNow){
    
    let priceElement = await page.$('#price_inside_buybox')
    let value = await page.evaluate(el => el.textContent, priceElement)

    value = Number(value.replace(/[^0-9\.]+/g, ""))
    if(value < maximumPrice){
      console.log("found " + item.name)
      await sendNotification(item.url,item.name)
    }
    if(value < maximumPrice && configuration.buyItems === true){
      await pickHighestAmount(page,maximumQuantity)
      await pageHelpers.clickAndWait(page,"#add-to-cart-button")
      await pageHelpers.clickAndWait(page,'#hlb-ptc-btn-native')
      const loginPage = await page.$('#continue').catch();
      if(loginPage){
        await logIntoAmazon(page)
      }
      if(configuration.buyItems === true){
        await page.click('#submitOrderButtonId')
      }
      return "bought"
      
      
    }
  }
  return "not bought"


}
async function logIntoAmazon(page){
  await page.focus('#ap_email')
  await page.keyboard.type(configuration.amazon.amazonUsername)  
  await pageHelpers.clickAndWait(page,"#continue")
  await page.focus('#ap_password')
  await page.keyboard.type(configuration.amazon.amazonPassword)  
  await pageHelpers.clickAndWait(page,'#signInSubmit')
}
async function pickHighestAmount(page,maximumQuantity){
  await page.click('#a-autoid-0-announce')

  let purchaseLimit = await page.$$('[id^=quantity_]')
  if(maximumQuantity > purchaseLimit.length){
     await page.click('#quantity_'+String(purchaseLimit.length - 1))
  }else{
     await page.click('#quantity_'+String(maximumQuantity - 1))
  }

}


