// This middleware is to be used to confirm that the request being made to the backend server is from slack
const crypto = require('crypto'); // Node library used to create a hash
const qs = require('qs'); // library used for creating a querystring using the space encoding format RFC1738

function Slack_Verification_check(req, res, next){
  const timestamp = req.get('x-slack-request-timestamp');
  let now = Date.now() / 1000;

  // if message is older than 5 minitues ignore it
  if(Math.abs(now - timestamp) > 60 * 5){
    return res.status(400).send('Ignore request');
  } else {
    // slack signature hash sent with the request
    const slack_sign = req.get('x-slack-signature');
    const signing_secret = process.env.SLACK_SIGNING_SECRET;
    
    // converts the req.body from JSON into a querystring used in the creation of the hash signature
    const payload = qs.stringify(req.body, { format : 'RFC1738'});
    const sign_base_string = 'v0:' + timestamp + ':' + payload;

    // creates the hash for comparison to the one sent in the headers by slack using the request body, request timestamp and the signing secret from the slack app
    const request_sign = 'v0=' + crypto.createHmac('sha256', signing_secret).update(sign_base_string).digest('hex');

    // compare hashes using a constant time compare method from crypto library
    if(crypto.timingSafeEqual(Buffer.from(slack_sign), Buffer.from(request_sign))){
      next();
    } else{
      return res.status(400).send('Request not verified');
    }
  }
}

module.exports = Slack_Verification_check;