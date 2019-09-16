// This file exports a default helper function to
// narrow down the search results and only return
// the information we intend to log through #slack

// use trimsearch(arr) or trimsearch(arr, 5)
// Second argument is optional and will override the
// max number of results to provide.
exports.trim = (arr, limit = 3) => {
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

exports.trimmedString = (arr) => {
  let result = "";
  for(let i = 0; i < arr.length; i++) {
    result += `${i + 1}) ${arr[i].name}\n${arr[i].URL}\n`
  }
  return result;
}

exports.selectOptions = (arr, question, match_type, sim_metric) => {
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
