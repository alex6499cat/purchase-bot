const buyAmazonIfInStock = require('./buyers/AmazonBuyer')
const buyTargetIfInStock = require('./buyers/TargetBuyer')
const buyBestBuyIfInStock = require('./buyers/BestBuyBuyer')
module.exports =  async function getBuyer(buyerName) {

  if(buyerName === 'amazon'){
    return buyAmazonIfInStock
  }else if(buyerName === 'target'){
    return buyTargetIfInStock
  }else if(buyerName === 'bestbuy'){
    return buyBestBuyIfInStock
  }
  
}
  
  

  