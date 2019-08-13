const router = require("express").Router();
const db = require("../../data/dbConfig");

router.get("/all", (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  db("user_history")
    .offset(offset)
    .limit(limit)
    .then(dbRes => {
      res.status(200).json(dbRes);
    })
    .catch(error => {
      console.log({ error, message: error.message });
    });

});

router.get("/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  db("user_history")
    .where({ user_id })
    .offset(offset)
    .limit(limit)
    .then(dbRes => {
      res.status(200).json(dbRes);
    })
    .catch(error => {
      console.log({ error, message: error.message });
    });
});

router.post("/", (req, res) => {
  const { user_id, question, bot_response } = req.body;
  db("user_history")
    .insert({ user_id, question, bot_response })
    .then(dbRes => {
      res.status(201).json("OK");
    })
    .catch(error => console.log(error));
});

module.exports = router;
