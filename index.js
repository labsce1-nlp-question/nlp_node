require("dotenv").config();

const express = require("express");
// Creates express app
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const axios = require("axios");

// Helpers
const format = require("./helpers/format");

// Database
const db = require("./data/dbConfig");

// ROUTERS
const logsRouter = require("./api/routers/logsRouter");

// Env Vars used for Express server
const PORT = process.env.PORT || 3000;
const SEARCH_URL =
  process.env.SEARCH_URL || "https://nlp-question.herokuapp.com/";

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ROUTE MIDDLEWARE
app.use("/api/logs", logsRouter);

app.post("/bot", (req, res) => {
  //console.log(req.body);

  const question = { question: req.body.text };
  console.log("BODY: ", req.body);

  axios
    .post(`${SEARCH_URL}qa`, question)
    .then(response => {
      // Temporary change to filter out duplicates
      // OLD: const trimmed = format.trim(response.data.matches, 3);
      // TEMP: const trimmed = format.trim(Array.from(new SET(response.data.matches)), 3);
      const trimmed = format.trim(
        Array.from(new Set(response.data.matches)),
        3
      );
      // console.log(response.data)
      db("test_log")
        .insert({ data: req.body, question: req.body.text })
        .then(dbRes => {
          console.log("LOGGED TO DB RES: ", dbRes);
        });

      var data = {
        form: {
          token: process.env.SLACK_AUTH_TOKEN,
          channel: req.body.channel_name,
          text: response.data.matches[0]
            ? `${question.question}\n${trimmed}`
            : "No Results"
        }
      };
      request.post("https://slack.com/api/chat.postMessage", data, function(
        error,
        response,
        body
      ) {
        // Sends welcome message
        if (error) {
          console.log(error);
        }
        res.json();
      });
    })
    .catch(err => console.log(err));
});

// Code for ephemeral
// Converts the trimmed array into a JSON object, this is needed for the attachments object when sending a 
// // Ephemeral through the slack API
// const results = JSON.stringify([{pretext: trimmed}]);

// //console.log('results: ',results)
// //console.log(response.data.matches)

// // For formating the object for the post request to the slack API please look here https://api.slack.com/docs/message-formatting
// var data = {
//     form: {
//         token: process.env.SLACK_AUTH_TOKEN,
//         attachments: results,
//         channel: req.body.channel_name,
//         text: "Here's what I found ",
//         user: req.body.user_id
//     }
// };
// request.post('https://slack.com/api/chat.postEphemeral', data, function (error, response, body) {
//     // Sends welcome message
//     console.log(response.body)
//     if (error){
//         console.log(error);
//     }
//     res.json();
// });

app.listen(PORT, function() {
  console.log("Bot is listening on port " + PORT);
});
