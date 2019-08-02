const router = require("express").Router();
const db = require("../../data/dbConfig");
const format = require("../../helpers/format");
const log = require("../../helpers/log");
const axios = require("axios");

const SEARCH_URL =
  process.env.SEARCH_URL || "https://nlp-question.herokuapp.com/";

// MAIN BOT ROUTE
router.post("/", (req, res) => {

  const question = { question: req.body.text };
  console.log("BODY: ", req.body);

  axios
    .post(`${SEARCH_URL}qa`, question)
    .then(response => {
      // Log to 'empty_results' if no results
      if(response.data.length === 0) {
        log.noResult(req.body, req.body.text);
      }
      const trimmed = format.trim((response.data));
      const trimmedString = format.trimmedString(trimmed);
      // console.log(response.data)
      db("test_log")
        .insert({ data: req.body, question: req.body.text })
        .then(dbRes => {
          console.log("LOGGED RESPONSE");
        })
        .catch(err =>
          console.log("ERROR: ", { error: err, message: err.message })
        );

      let data = {
          response_type:"in_channel",
          text: response.data[0]
            ? `${question.question}\n${trimmedString}`
            : "No Results"
      };
      // axios post request to the response_url provided when the user does a slash command and sends a request to this end-point
      // using the response_url allows us to send back a response to the users channel even if it is private
      axios.post(req.body.response_url, data)
        .then(() => {
          // This sends an empty response to slack, letting slack know we have received the request 
          res.json();
          // Object used for sending an ephemeral for receving feedback from the user
          const ephemeral = {
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

// Feedback end-point SlackBot points to
// Feedback helper use
// log.feedback(question, bot_response, user_response, body)
router.post("/feedback", (req, res) => {
  console.log("feedback received!", req.body);
});

module.exports = router;
