const axios = require("axios");

const SEARCH_URL =
  process.env.SEARCH_URL || "https://nlp-question.herokuapp.com/";

const SendQuestion = question => {
  return axios
    .post(`${SEARCH_URL}qa`, question)
    .then(res => {
      // console.log(res.data);
      return res.data;
    })
    .catch(err => DebugLog('python api error: ',err));
};

module.exports = {
  SendQuestion
}