// This file exports a default helper function to
// narrow down the search results and only return
// the information we intend to log through #slack

// use trimsearch(arr) or trimsearch(arr, 5)
// Second argument is optional and will override the
// max number of results to provide.
const trim = (arr, limit = 3) => {
  // Otherwise construct the return statemtne
  let result = [];
  for (let i = 0; i < arr.length && i <= limit - 1; i++) {
    result.push({
      id: arr[i].id, 
      name: arr[i].name, 
      URL: arr[i].URL, 
      description: arr[i].description
    });
  }
  return result;
};

const trimmedString = (arr) => {
  let result = "";
  for(let i = 0; i < arr.length; i++) {
    result += `${i + 1}) ${arr[i].name}\n${arr[i].URL}\n`
  }
  return result;
}

const selectOptions = (arr, question, match_type, sim_metric) => {
  let result = [];
  for(let i = 0; i < arr.length; i++){
    result.push({
      text: `${i + 1}) ${arr[i].name}`, 
      value: JSON.stringify({
        question: question,
        url_selected: arr[i],
        search_res: arr,
        positive_res: true,
        match_type,
        similarity_metrics: sim_metric
      })
    });
  }

  result.push({text: 'None', value: JSON.stringify({
      question: question, 
      search_res: arr, 
      positive_res: false, 
      match_type,
      similarity_metrics: sim_metric
    })
  });

  return result;
}

const SlackDataObject = (results, question) => {
  // convert the data from the python api into a string to be sent to slack
  const resultsString = results.match.length != 0 ? trimmedString(results.match): null;
  // formats the trimmed array of result links along with the question asked into an array of objects
  const options = results.match.length != 0 ? selectOptions(results.match, question, results.match_type, results.similarity_metrics): null;

  const data = {
    response_type:"ephemeral",
    text: results.match.length != 0
      ? `*Question: ${question}*\n\n${resultsString}`
      : `*Question: ${question}*\n\nProduced no results please try asking a different question. I'll take note of this.`,
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
            options: options
          }
        ]
      }
    ]
  }

  return data;
}


module.exports = {
  trim,
  trimmedString,
  selectOptions,
  SlackDataObject
}