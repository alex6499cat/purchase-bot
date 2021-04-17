const puppeteer = require('puppeteer');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const getBuyer = require('./buyerFactory')
const products = require('../products.json')


async function configureBrowser() {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    return page;
}



async function startTracking() {
    const page = await configureBrowser();
    let productCopy = JSON.parse(JSON.stringify(products))
    let count = 0
    let max = productCopy.length
    let job = new CronJob('*/30 * * * * *', async function() { //runs every 15 second in this config
      if(productCopy.length > 0){
        let currentIndex = count % max
        await page.goto(productCopy[currentIndex].url,{ waitUntil: ["networkidle0", "domcontentloaded"] })
        const buyer = await getBuyer(productCopy[currentIndex].website)
        let result = await buyer(page,productCopy[currentIndex].maximumPrice,productCopy[currentIndex].maximumQuantity,productCopy[currentIndex]);
        if(result === "bought"){
          productCopy.splice(currentIndex,1)
          max = productCopy.length
          count = 0
        }else{
          count++
        }
      }else{
        console.log("Bought Everything!")
      }
    }, null, true, null, null, true);
    job.start();
}


startTracking()