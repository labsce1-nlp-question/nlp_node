const router = require("express").Router();
const axios = require("axios");


router.get('/', (req, res) =>{
  res.sendFile(__dirname +'/add-to-slack.html') //get this from slack, they'll make an html file for you
});

router.get('/redirect', async (req, res) => {
  const uri = `https://slack.com/api/oauth.access?code=${req.query.code}&client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&redirect_uri=${process.env.REDIRECT_URI}`
  
  const reply = await axios.get(uri);
  // reply has the xoxb token for each slack instance
  if (reply.status !== 200) {
    res.send("Error encountered: \n"+JSON.stringify(reply.statusText)).status(200).end();
  } else {
    res.send("Success!");
  }
});

module.exports = router;