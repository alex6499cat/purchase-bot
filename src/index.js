const puppeteer = require('puppeteer');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const getBuyer = require('./buyerFactory')
const config = require('../buyerConfig.json')

async function configureBrowser() {
    const browser = await puppeteer.launch({headless:config.headless});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.setDefaultNavigationTimeout(0); 
    return page;
}



async function startTracking(){
    const page = await configureBrowser();
    let productCopy = JSON.parse(JSON.stringify(config.products))
    let count = 0
    let max = productCopy.length
    while(true){
      if(productCopy.length > 0){
        let currentIndex = count % max
        await page.goto(productCopy[currentIndex].url,{ waitUntil: ["networkidle0", "domcontentloaded"] })
        const buyer = await getBuyer(productCopy[currentIndex].website)
        let result = await buyer(page,productCopy[currentIndex].maximumPrice,productCopy[currentIndex].maximumQuantity,productCopy[currentIndex]);
        if(result === "bought"){
          console.log("bought " + productCopy[currentIndex].name)
          productCopy.splice(currentIndex,1)
          max = productCopy.length
          count = 0
          
        }else{
          count++
        }
      }else{
        console.log("Bought Everything!")
      }
      //await page.waitForTimeout(3000);
    }
    job.start();
}

startTracking()

