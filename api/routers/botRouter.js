const router = require("express").Router();
const userHistoryDB = require("../../data/models/userHistoryDB.js");
const userDB = require("../../data/models/usersDB.js");
const format = require("../../helpers/format");
const log = require("../../helpers/log");
const axios = require("axios");
const slack_verification = require('../../helpers/middleware/slack_auth.js');

const SEARCH_URL =
  process.env.SEARCH_URL || "https://nlp-question.herokuapp.com/";

// MAIN BOT ROUTE
router.post("/", slack_verification, async (req, res) => {

  const question = { question: req.body.text };
  console.log("BODY: ", req.body);
  const userInDB = await userDB.getUserBySlackId(req.body.user_id);
  
  if(!userInDB){
    userDB.addUser(req.body.user_id);
    console.log("Added a user to the Database")
  }
  axios
    .post(`${SEARCH_URL}qa`, question)
    .then(response => {
      // console.log(response.data)
      // Log to 'empty_results' if no results
      if(response.data.length === 0) {
        log.noResult(req.body, req.body.text);
      }
      const trimmed = response.data.match.length > 3 ? format.trim((response.data)) : response.data.match;
      const trimmedString = format.trimmedString(trimmed);
      
      // Log users question and the Python api response to the database 
      userHistoryDB.addUserHistory(req.body.user_id, req.body.text, JSON.stringify(trimmed));

      let data = {
          response_type:"ephemeral",
          text: response.data.match
            ? `${question.question}\n${trimmedString}`
            : "No Results"
      };
      // axios post request to the response_url provided when the user does a slash command and sends a request to this end-point
      // using the response_url allows us to send back a response to the users channel even if it is private
      axios.post(req.body.response_url, data)
        .then(() => {
          // This sends an empty response to slack, letting slack know we have received the request 
          res.json();
          // formats the trimmed array of result links along with the question asked into an array of objects
          let selectOptions = format.selectOptions(trimmed, question.question, response.data.match_type, response.data.similarity_metrics);
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
                      text: "Which link was helpful?",
                      options: selectOptions
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
    .catch(err => console.log('error:',err));
});

// Feedback end-point SlackBot points to
// Feedback helper use
// log.feedback(question, bot_response, user_response, body)
router.post("/feedback", slack_verification, (req, res) => {
    let fb = JSON.parse(req.body.payload); // string sent to this end-point after a user selects an option from the interactive message in slack
    let value = JSON.parse(fb.actions[0].selected_options[0].value); 
    // console.log("feedback received!\n", fb);
    // console.log("feedback received!\n", value);
    log.feedback(value.question, JSON.stringify(value.search_res), value.positive_res, fb, value.match_type, value.similarity_metrics);
    
    //Response object used to replace the interactive message that was sent to the user after they have submitted feedback that was logged
    const response = {
      response_type: "ephemeral",
      replace_original: true,
      text: "Thanks for your feedback!"
    };
    axios.post(fb.response_url, response).then(res => console.log(res.data)).catch(err => console.log(err));  
});

module.exports = router;
