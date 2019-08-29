const router = require("express").Router();
const usersDB = require("../../data/models/usersDB.js");
const axios = require("axios");

const FrontEndUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

router.get('/', (req, res) =>{
  res.sendFile(__dirname +'/add-to-slack.html') 
});

router.get('/redirect', async (req, res) => {
  const uri = `https://slack.com/api/oauth.access?code=${req.query.code}&client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&redirect_uri=${process.env.REDIRECT_URI}`
  
  const reply = await axios.get(uri);
  // reply has the xoxb token for each slack instance
  if (reply.status !== 200) {
    res.send("Error encountered: \n"+JSON.stringify(reply.statusText)).status(200).end();
  } else {
    if(reply.data.user){
      res.redirect(`${FrontEndUrl}/slack-login/?${reply.data.user.id}`);
    } else {
      res.send("Success!");
    }
  }
});

module.exports = router;