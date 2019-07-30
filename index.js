//For local testing use a tunnel program. For testing purposes i am using ngrok
//start up ngrok with the command ngrok http 3000 in the shell terminal
//use the url it provides for the test slackbot on the api.slack webapp

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

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.post('/', (req, res) => {
    //console.log(req.body);

    const question = { question: req.body.text };

    axios.post("https://qa-api-alpha.herokuapp.com/qa", question)
        .then( response => {
            const trimmed = format.trim(response.data.matches, 3);

            
        })
        .catch( err => console.log(err));
});

app.listen( PORT, function() {
  console.log('Bot is listening on port ' + PORT);
});
