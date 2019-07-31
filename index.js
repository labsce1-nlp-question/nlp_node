require("dotenv").config();

const express = require("express");
// Creates express app
const app = express();
const bodyParser = require("body-parser");
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
          response_type:"in_channel",
          text: response.data.matches[0]
            ? `${question.question}\n${trimmed}`
            : "No Results"
      };
      // axios post request to the response_url provided when the user does a slash command and sends a request to this end-point
      // using the response_url allows us to send back a response to the users channel even if it is private
      axios.post(req.body.response_url, data)
        .then(() => {
          // This sends an empty response to slack, letting slack know we have received the request 
          res.json();
          //object used for sending back data to where the request came from. 
          var ephemeral = {
            response_type: "ephemeral",
            attachments: [
                {
                  fallback: "If you could read this message, you'd be choosing something fun to do right now.",
                  callback_id: "feedback_selection",
                  attachment_type: "default",
                  actions: [
                    {
                      name: "Feedback",
                      type: "select",
                      text: "Was this helpful?",
                      options: [
                        {
                          text: "Yes",
                          value: "True"
                        },
                        {
                          text: "No",
                          value: "False"
                        }
                      ]
                    }
                  ]
                }
            ]
          };
          // After sending the data received from the python search API this will then send a ephemeral
          axios.post(req.body.response_url, ephemeral).then(res => console.log(res.data));
        })
        .catch(err => console.log('error: ', err));
    })
    .catch(err => console.log(err));
});

app.post("/feedback", (req, res) => {
  console.log("feedback received!", req.body);
});

app.listen(PORT, function() {
  console.log("Bot is listening on port " + PORT);
});
