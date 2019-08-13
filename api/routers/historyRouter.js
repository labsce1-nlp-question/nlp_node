const router = require("express").Router();
const userhDB = require("../../data/models/userHistoryDB.js");

router.get("/all", async (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  try {
    const userHistory = await userhDB.getAllUserHistory(limit, offset);
    
    res.status(200).json(userHistory);
  } catch(err) {
    res.status(500).json({ error: `Unable to get all User History: ${err}`});
  }
});

router.get("/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  try {
    const userH = await userhDB.getUserHistoryById(user_id, limit, offset);
   
    res.status(200).json(userH);
  } catch(err) {
    res.status(500).json({ error: `Unable to get User history by id: ${err}`});
  }
});

router.post("/", async (req, res) => {
  const { user_id, question, bot_response } = req.body;
  try {
    const userH = await userhDB.addUserHistory(user_id, question, bot_response);
    
    res.status(201).json(userH);
  } catch(err) {
    res.status(500).json({ error: `Unable to add User History: ${err}`});
  }
});

module.exports = router;
