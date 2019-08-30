const router = require("express").Router();
const userhDB = require("../../data/models/userHistoryDB.js");
const { authenticate } = require('../../helpers/middleware/authenticate.js');

// End-point used to GET the history of all users in the Database

// router.get("/all", async (req, res) => {
//   const limit = req.query.limit || 20;
//   const offset = req.query.offset || 0;

//   try {
//     const userHistory = await userhDB.getAllUserHistory(limit, offset);
    
//     res.status(200).json(userHistory);
//   } catch(err) {
//     res.status(500).json({ error: `Unable to get all User History: ${err}`});
//   }
// });

// GET a users history by their Slack ID
router.get("/", authenticate, async (req, res) => {
  const slack_id = req.decoded.subject;
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  try {
    const userH = await userhDB.getUserHistoryById(slack_id, limit, offset);
   
    res.status(200).json(userH);
  } catch(err) {
    res.status(500).json({ error: `Unable to get User history by id: ${err}`});
  }
});

module.exports = router;
