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
    result.push({name: arr[i].name, URL: arr[i].URL});
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
