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

// GET a search history by it's ID in the Database
router.get("/:id", authenticate, async (req, res) => {
  const id = req.params.id;

  try {
    const history = await userhDB.getHistoryById(id);

    res.status(200).json(history);
  } catch(err) {
    res.status(500).json({ error: `Unable to get history by id: ${err}`});
  }
});

// Add a note to a question that a user asked
router.put("/update-note/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const { notes, title } = req.body;
  
  try {
    const addNote = await userhDB.updateUserHistoryWithNote(id, notes, title);

    res.status(200).json(addNote);
  } catch (err) {
    res.status(500).json({ error: `Unable to add the note to the users history: ${err}`});
  }
});

// Delete a users note from their user history
router.put("/delete-note/:id", authenticate, async (req, res) => {
  const id = req.params.id;

  try {
    const deleteNote = await userhDB.deleteUserHistoryNote(id);

    res.status(200).json(deleteNote);
  } catch(err) {
    res.status(500).json({ error: `Unable to delete the users note: ${err}` });
  }
});

module.exports = router;
