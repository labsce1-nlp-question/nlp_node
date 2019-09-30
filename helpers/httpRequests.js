const axios = require("axios");

const SEARCH_URL =
  process.env.SEARCH_URL || "https://nlp-question.herokuapp.com/";

const SendQuestion = question => {
  return axios
    .post(`${SEARCH_URL}qa`, question)
    .then(res => {
      // console.log("ran");
      if(res.data.match.length === 0){
        return -1;
      } else {
        return res.data;
      }
    })
    .catch(err => console.log('python api error: ',err));
};

module.exports = {
  SendQuestion
}