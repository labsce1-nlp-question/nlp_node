const router = require("express").Router();
const db = require("../../data/dbConfig");
const format = require("../../helpers/format");
const request = require("request");
const axios = require("axios");

const SEARCH_URL =
  process.env.SEARCH_URL || "https://nlp-question.herokuapp.com/";

// MAIN BOT ROUTE
router.post("/", (req, res) => {
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
        })
        .catch(err =>
          console.log("ERROR: ", { error: err, message: err.message })
        );

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

module.exports = router;
