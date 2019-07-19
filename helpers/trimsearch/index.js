// This file exports a default helper function to
// narrow down the search results and only return
// the information we intend to log through #slack

// use trimsearch(arr) or trimsearch(arr, 5)
// Second argument is optional and will override the
// max number of results to provide.
export default (arr, limit = 3) => {
  // if the array is empty return nothing found
  if (arr.length === 0){ 
    return "No results found for that search" 
  }
  // Otherwise construct the return statemtne
  const result = "";
  for(let i = 0; i < arr.length && i <= limit; i++){
    let title = arr[0];
  }
}