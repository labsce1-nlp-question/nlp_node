const db = require("../../data/dbConfig");

exports.noResult = (data, question) => {
  db('empty_results')
    .insert({data, question})
    .then(res => console.log("LOGGED A NON RESPONSE"))
    .catch(err => console.log({err, message: err.message}))
}

exports.feedback = (question, bot_response, user_response, body, match_type, sim_metrics) => {
  db('feedback')
    .insert({question, bot_response, user_response, body, match_type, similarity_metrics: sim_metrics})
    .then(res => console.log("LOGGED USER FEEDBACK"))
    .catch(err => console.log({err, message: err.message}))
}

exports.error = (error, body) => {
  db('errors')
    .insert({ error, body })
    .then(res => console.log("LOGGED ERROR"))
    .catch(err => console.log({err, message: err.message}));
}