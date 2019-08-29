// This middleware is to be used to confirm that the request being made to the backend server is from slack
const crypto = require('crypto');
const qs = require('qs');

function Slack_Verification_check(req, res, next){
  const timestamp = req.get('x-slack-request-timestamp');
  let now = Date.now() / 1000;

  // if message is older than 5 minitues ignore it
  if(Math.abs(now - timestamp) > 60 * 5){
    return res.status(400).send('Ignore request');
  } else {
    const slack_sign = req.get('x-slack-signature');
    const signing_secret = process.env.SLACK_SIGNING_SECRET;
    
    const payload = qs.stringify(req.body, { format : 'RFC1738'});
    const sig_base_string = 'v0:' + timestamp + ':' + payload;
    const request_sign = 'v0=' + crypto.createHmac('sha256', signing_secret).update(sig_base_string).digest('hex');

    // compare hashes using a constant time compare method from crypto library
    if(crypto.timingSafeEqual(Buffer.from(slack_sign), Buffer.from(request_sign))){
      next();
    } else{
      return res.status(400).send('Request not verified');
    }
  }
}

module.exports = Slack_Verification_check;