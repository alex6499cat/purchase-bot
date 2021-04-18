module.exports =  async function sendNotification(url,name) {
    const configuration = require('../buyerConfig.json')
    const Discord = require('discord.js');
    const bot = new Discord.Client();

    const TOKEN = configuration.discord.token;
    const CHANNEL_ID = configuration.discord.channelId

    bot.on('ready', () => {
        bot.channels.cache.get(CHANNEL_ID).send("The item: " + name + " is in stock! " + url)
    });
    if(configuration.discord.activated){
        bot.login(TOKEN);
    }
    
}
