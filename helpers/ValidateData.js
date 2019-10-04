// This functions purpose is to ensure that when a request is sent to the backends end-points that
// the data sent with the request looks as it should. For example if a put request is sent to update
// a user's note for a specific history, the note or title should be a string data type other was the
// data is not valid.

const ValidateData = data => {
  let isvalid = true;

  if(data){
    if(typeof data != 'object'){
      return false;
    } else {
      // check if a question key exists
      // if it does verify that its value is the correct data type
      if(data.question && typeof data.question != 'string') return false;
      
      // check if notes key exits and that it is a string
      if(data.notes && typeof data.notes != 'string') isvalid = false;

      // check if title key exits and that it is a string
      if(data.title && typeof data.title != 'string') isvalid = false;
      
      // if both notes and title keys are not present but the data is an object
      // and there is no question key return null
      if(!data.notes && !data.title && !data.question) return null;

      return isvalid;
    }
  } else {
    return null;
  }
};

const isNumeric = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = {
  ValidateData,
  isNumeric
}