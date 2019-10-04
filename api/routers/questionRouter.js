const router = require("express").Router();
const log = require("../../helpers/log");
const userHistoryDB = require("../../data/models/userHistoryDB.js");
const { authenticate } = require('../../helpers/middleware/authenticate.js');
const { SendQuestion } = require("../../helpers/httpRequests.js");
const { ValidateData } = require("../../helpers/ValidateData.js");

router.post("/", authenticate, async (req, res) => {
  const question = { question: req.body.question };
  const valid = ValidateData(req.body);

  if(valid === null){
    res.status(400).json({ error: 'A body is required for this request. Please include a question' });
  } else if( valid ){
    try {
      // send question to the Python api and await the results
      const results = await SendQuestion(question);
  
      if(results.match.length == 0) {
        const data = {...req.body, user_id: req.decoded.subject };
  
        log.noResult(data, req.body.question)
  
        res.status(200).json({ message: "No results found" });
      } else {        
        // Log users question and the Python api response to the database 
        const user_history = await userHistoryDB.addUserHistory(req.decoded.subject, req.body.question, JSON.stringify(results));
  
        res.status(200).json({ response: results.match, user_history });
      }
  
    } catch(err) {
      // console.log("Catch error: ", err);
      log.error(err, req.body);
      res.status(500).json({ error: `Unable to ask the question: ${err}`});
    }
  } else {
    res.status(400).json({ error: 'Unable to send the request. The question must be a string' });
  }
});

module.exports = router;