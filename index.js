const SlackBot = require('slackbots');
const axios = require('axios');

require('dotenv').config()

const bot = new SlackBot({
    token: 'process.env.BOT_TOKEN',
    name: 'process.env.BOT_NAME'
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
    if(message.includes('<@ULES3CC68>')) {
        const URL = `https://www.googleapis.com/books/v1/volumes?q=`
        const searchTerm = message.slice(12);
        // const bookList = ''

        axios.get(`${URL}'${searchTerm}'`)
            .then(res => const bookList = res.data.items)
            .then(console.log(bookList))
    }
}

