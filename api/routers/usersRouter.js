const router = require("express").Router();
const usersDB = require("../../data/models/usersDB");

router.get("/all", async (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  try {
    const users = await usersDB.getUsers(offset, limit);

    res.status(200).json(users);
  } catch(err){
    res.status(500).json({ error: `Unable to get Users: ${err}`})
  }
});

router.get("/:id", async (req, res) => {
  const slack_id = req.params.id;
  try {
    const user = await usersDB.getUserById(slack_id);

    res.status(200).json(user);
  } catch(err){
    res.status(500).json({ error: `Unable to get the User: ${err}`});
  }
});

router.post("/", async (req, res) => {
  const { slack_id, preferences } = req.body;
  
  try {
    const newUser = await usersDB.addUser(slack_id, preferences);

    res.status(201).json(newUser);
  } catch(err) {
    res.status(500).json({ error: `Unable to get the User: ${err}`});
  }
});

module.exports = router;
