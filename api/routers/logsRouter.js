const router = require("express").Router();
const db = require("../../data/dbConfig");

// GET ALL LOGS
// OPTIONALY QS: [limit, offset]
router.get("/requests", (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  db("test_log")
    .offset(offset)
    .limit(limit)
    .orderBy("time", "desc")
    .then(dbRes => {
      res.status(200).json(dbRes);
    })
    .catch(error => {
      const errObj = {
        error: error,
        message: error.message
      };
      console.log(json(errObj));
    });
});

module.exports = router;
