const router = require("express").Router();
const db = require("../../data/dbConfig");

// GET ALL LOGS
// OPTIONAL QS: [limit, offset]
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
      console.log(JSON.stringify(errObj));
    });
});

// GET EMPTY RESPONSES
// OPTIONAL QS: [limit, offset]
router.get("/nores", (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  db("empty_results")
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
      console.log(JSON.stringify(errObj));
    });
});

// GET USER FEEDBACK
// OPTIONAL QS: [limit, offset]
router.get("/feedback", (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  db("feedback")
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
      console.log(JSON.stringify(errObj));
    });
});

module.exports = router;
