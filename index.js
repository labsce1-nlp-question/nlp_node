const SlackBot = require('slackbots');
const axios = require('axios');

require('dotenv').config()

const bot = new SlackBot({
    token: process.env.BOT_TOKEN,
    name: process.env.BOT_NAME
});

//Start Handler
bot.on('start', () => {
    const params = {
        icon_emoji: ':smodibot:'
    }

    bot.postMessageToChannel('general', 'Ask @smodibot for a list of books', params)
});

//Error Handler
bot.on('error', (err) => console.log(err));

// Message Handler
bot.on('message', (data) => {
    if (data.type !== 'message') {
        return;
    }
    handleMessage(data.text);
})

function handleMessage(message) {
        console.log("Handled")
    }


