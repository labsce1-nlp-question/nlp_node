const router = require("express").Router();
const axios = require("axios");
const format = require("../../helpers/format");
const log = require("../../helpers/log");
const userHistoryDB = require("../../data/models/userHistoryDB.js");
const { authenticate } = require('../../helpers/middleware/authenticate.js');

const SEARCH_URL =
  process.env.SEARCH_URL || "https://nlp-question.herokuapp.com";

router.post("/", authenticate, async (req, res) => {
  const question = { question: req.body.question };

  axios
    .post(`${SEARCH_URL}/qa`, question)
    .then(response => {

      if(response.data.length == 0) {
        const data = {...req.body, user_id: req.decoded.subject };

        log.noResult(data, req.body.question)

        res.status(200).json({ message: "No results found" });
      } else {
        // trim the results from the python api
        const trimmed = format.trim(response.data, 5);
        
        // Log users question and the Python api response to the database 
        userHistoryDB.addUserHistory(req.decoded.subject, req.body.question, JSON.stringify(trimmed));

        res.status(200).json(trimmed);
      }
    })
    .catch(err => res.status(500).json({ message: `Unable to ask the question: ${err}` }));
});

module.exports = router;