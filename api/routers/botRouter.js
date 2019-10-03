const router = require("express").Router();
const userHistoryDB = require("../../data/models/userHistoryDB.js");
const userDB = require("../../data/models/usersDB.js");
const format = require("../../helpers/format");
const log = require("../../helpers/log");
const axios = require("axios");
const slack_verification = require('../../helpers/middleware/slack_auth.js');
const { SendQuestion } = require("../../helpers/httpRequests.js");

// MAIN BOT ROUTE
router.post("/", slack_verification, async (req, res) => {

  const question = { question: req.body.text };
  // console.log(req.body, "BODY:");
  
  try {
    
    const userInDB = await userDB.getUserBySlackId(req.body.user_id);
    
    // Add user to database if they are not already added
    if(!userInDB) userDB.addUser(req.body.user_id);

    // This sends an empty response to slack, letting slack know we have received the request 
    res.status(200).json();
    
    // send question to the python api, await the promise to be resolved and create the data object for Slack
    const results = await SendQuestion(question);

    // Log to 'empty_results' if no results
    if(results.match.length === 0) {
      log.noResult(req.body, req.body.text);
    }

    // Log users question and the Python api response to the database 
    userHistoryDB.addUserHistory(req.body.user_id, req.body.text, JSON.stringify(results));
    
    // create a data object to be used to send to the Slack api
    const data = format.SlackDataObject(results, question.question);
    
    // axios post request to the response_url provided when the user does a slash command and sends a request to this end-point
    // using the response_url allows us to send back a response to the users channel even if it is private
    // ---- SLACK WEB HOOK CALL ------
    axios.post(req.body.response_url, data)
      .then(response => {
        // console.log("slack response:",response.data)
      })
      .catch(err => log.error(err, req.body));

  } catch(err){
    log.error(err, req.body);
  }
  
});

// Feedback end-point SlackBot points to
// Feedback helper use
// log.feedback(question, bot_response, user_response, body)
router.post("/feedback", slack_verification, (req, res) => {
    let fb = JSON.parse(req.body.payload); // string sent to this end-point after a user selects an option from the interactive message in slack
    let value = JSON.parse(fb.actions[0].selected_options[0].value); 
    //console.log("feedback received!\n", fb);
    //console.log("feedback received!\n", value);
    log.feedback(value.question, JSON.stringify(value.search_res), value.positive_res, fb, value.match_type, value.similarity_metrics);
    
    //Response object used to replace the interactive message that was sent to the user after they have submitted feedback that was logged
    const response = {
      response_type: "ephemeral",
      replace_original: true,
      text: "Thanks for your feedback!"
    };

    axios.post(fb.response_url, response)
      .then(res => {
        // console.log(res.data)
      })
      .catch(err => log.error(err, req.body));  
});

module.exports = router;
