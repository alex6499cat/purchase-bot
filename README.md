## Purchase Bot

This is node.js application that can purchase items off of Amazon, Target, Best Buy and provide discord notifications of in stock items. I do not guarantee that this bot will catch every item it is monitoring that goes in stock. I also don't guarantee that this bot will successfully buy your item when it goes in stock. Because of the nature of webpages constantly changing, crashing, or not loading, errors happen. I am also not a perfect developer lol. The discord notifications are a good backup in case the purchase does not work.

**I am not responsible if you somehow get yourself in trouble with this bot or buy something that you didn't intend to buy lol**

## How To
* You must have a default payment set on the websites that you are using (amazon, bestbuy, and target)
* cd to project location and run 
```
npm install
```
* Create a file in the root directory called buyerConfig.json. An example file is below.
* Execute the following command to start
```
npm run start
```

## buyerConfig.json
```

{
    "amazon":{
        "amazonUsername":"",
        "amazonPassword":""
    },
    "bestbuy":{
        "bestbuyUsername":"",
        "bestbuyPassword":"",
        "defaultPaymentSecurityCode":""
    },
    "target":{
        "targetUsername":"",
        "targetPassword":""
    },
    "discord":{
        "activated":true or false to send discord notifications,
        "token":"theApiTokenOfYourBot",
        "channelId":"idOfTheChannelThatYourBotIsIn"
    },
    "buyItems":true, //set to false if don't want it to try to buy (only want discord notifications)
    "headless":true, //set to false if you want to watch the bot do its thing
    "products":[ // you can set any number of products. But the more products that you have, the less likely you are to catch items that go in and out of stock very quickly.
        {
            "website":"amazon",
            "url":"https://www.amazon.com/Magic-Gathering-Spiral-Remastered-Booster/dp/B08SSSQHHF/ref=sr_1_1?dchild=1&keywords=time+spiral+remastered&qid=1618677837&sr=8-1",
            "name":"timespiral remastered boosterbox",
            "maximumPrice":200, // Will not buy unless the item is < this price
            "maximumQuantity":5 // Will try to buy up to this quantity. 
        },
        {
            "website":"bestbuy",
            "url":"https://www.bestbuy.com/site/pokemon-pokemon-tcg-shining-fates-elite-trainer-box-/6445827.p?skuId=6445827",
            "name":"shining fates etb",
            "maximumPrice":30,
            "maximumQuantity":25
        },
        {
            "website":"target",
            "url":"https://www.target.com/p/pok--233-mon-trading-card-game--shining-fates-elite-trainer-box/-/A-82291630",
            "name":"shining fates etb",
            "maximumPrice":55,
            "maximumQuantity":25
        }
    ]
    
}
```

