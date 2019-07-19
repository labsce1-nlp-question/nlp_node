require('dotenv').config();

const express = require('express');
// Creates express app
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const axios = require('axios');

// The port used for Express server
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.post('/', (req, res) => {
    //console.log(req.body);

    const question = { question: req.body.text };

    axios.post("https://qa-api-alpha.herokuapp.com/qa", question)
        .then( response => {
            const results = JSON.stringify([{pretext: response.data.matches[0].data.URL}]);
            console.log(results)
            var data = {
                form: {
                    token: process.env.SLACK_AUTH_TOKEN,
                    attachments: results,
                    channel: req.body.channel_name,
                    text: "Here's what I found ",
                    user: req.body.user_id
                
                }};
            // var data = {
            //     form: {
            //         token: process.env.SLACK_AUTH_TOKEN,
            //         channel: req.body.channel_name,
            //         text: response.data.matches[0].data.URL,
                
            //     }};
            request.post('https://slack.com/api/chat.postEphemeral', data, function (error, response, body) {
                // Sends welcome message
                console.log(response.body)
                if (error){
                    console.log(error);
                }
                res.json();
            });
        })
        .catch( err => console.log(err));

});

app.listen(process.env.PORT || PORT, function() {
  console.log('Bot is listening on port ' + PORT);
});
