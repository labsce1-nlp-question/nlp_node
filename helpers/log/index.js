const db = require("../../data/dbConfig");

exports.noResult = (data, question) => {
  db('empty_results')
    .insert({data, question})
    .then(res => console.log("LOGGED A NON RESPONSE"))
    .catch(err => console.log({err, message: err.message}))
}

exports.feedback = (question, bot_response, user_response, body) => {
  db('feedback')
    .insert({question, bot_response, user_response, body})
    .then(res => console.log("LOGGED USER FEEDBACK"))
    .catch(err => console.log({err, message: err.message}))
}