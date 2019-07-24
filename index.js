require('dotenv').config();

const express = require('express');
// Creates express app
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const axios = require('axios');

// Helpers
const format = require('./helpers/format');

// The port used for Express server
const PORT = process.env.PORT || 3000;
const SEARCH_URL = process.env.SEARCH_URL || "https://nlp-question.herokuapp.com/"

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.post('/', (req, res) => {
    //console.log(req.body);

    const question = { question: req.body.text };

    axios.post(`${SEARCH_URL}qa`, question)
        .then( response => {
          const trimmed = format.trim(response.data.matches, 3);
          // console.log(response.data)
            var data = {
                form: {
                    token: process.env.SLACK_AUTH_TOKEN,
                    channel: req.body.channel_name,
                    text: response.data.matches[0] ? `${question.question}\n${trimmed}` : 'No Results',
                }};
            request.post('https://slack.com/api/chat.postMessage', data, function (error, response, body) {
                // Sends welcome message
                if (error){
                    console.log(error);
                }
                res.json();
            });
        })
        .catch( err => console.log(err));

});

app.listen( PORT, function() {
  console.log('Bot is listening on port ' + PORT);
});
