const router = require("express").Router();
const userhDB = require("../../data/models/userHistoryDB.js");
const { authenticate } = require("../../helpers/middleware/authenticate.js");
const { ValidateData, isNumeric } = require("../../helpers/ValidateData.js");

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

// Grab all of a user's notes by their slack id
router.get("/notes", authenticate, async (req, res) => {
  const slack_id = req.decoded.subject;

  try {
    const userNotes = await userhDB.getUserNotes(slack_id);

    res.status(200).json(userNotes);
  } catch(err) {
    res.status(500).json({ error: `Unable to get the user's notes: ${err}`});
  }
});

// GET a search history by it's ID in the Database
router.get("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const slack_id = req.decoded.subject;

  if(isNumeric(id) === false){
    res.status(400).json({ error: 'The id must be a number' });
  } else {
    try {
      const history = await userhDB.getHistoryById(id, slack_id);
      
      if(history){
        res.status(200).json(history);
      } else if(history === -1){
        res.status(401).json({ error: 'Invalid user account'})
      } else {
        res.status(404).json({ error: 'History not found' });
      }

    } catch(err) {
      res.status(500).json({ error: `Unable to get history by id: ${err}`});
    }
  }
});

// Add a note to a question that a user asked
router.put("/update-note/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const slack_id = req.decoded.subject;
  const { notes, title } = req.body;
  // Check if the body sent in the request has valid data based on what data types are schema is expecting
  const valid = ValidateData(req.body);
  
  // if valid is null this means there was an no body sent with the request or notes/title is missing in the body
  if(valid === null ){
    res.status(400).json({ error: 'A body is required for this request. Please include a notes or title' });
    
    // check if the param id is a number 
  } else if(isNumeric(id) === false){ 
    res.status(400).json({ error: 'The id must be a number' });
  } else if(valid){
    try {
      const addNote = await userhDB.updateUserHistoryWithNote(id, slack_id, notes, title);
      
      if(addNote){
        if(addNote != -1){
          res.status(200).json(addNote);
        } else {
          res.status(401).json({ error: 'Invalid Slack Account' });
        }
      } else {
        res.status(404).json({ error: 'History not found' });
      }

    } catch (err) {
      res.status(500).json({ error: `Unable to add the note to the users history: ${err}`});
    }
  } else {
    res.status(400).json({ error: 'Unable to update the Note, notes and title must be a string' });
  }
  
});


// Delete a users note from their user history
router.put("/delete-note/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const slack_id = req.decoded.subject;

  if(isNumeric(id) === false){
    res.status(400).json({ error: 'The id must be a number' });
  } else {
    try {
      const deleteNote = await userhDB.deleteUserHistoryNote(id, slack_id);

      if(deleteNote){
        if(deleteNote != -1){
          res.status(200).json(deleteNote);
        } else {
          res.status(400).json({ error: 'Invalid Slack Account' });
        }
      } else {
        res.status(404).json({ error: 'Note not found' });
      }
      
    } catch(err) {
      res.status(500).json({ error: `Unable to delete the users note: ${err}` });
    }
  }
});

module.exports = router;
