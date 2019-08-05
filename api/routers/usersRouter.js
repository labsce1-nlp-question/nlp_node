const router = require("express").Router();

router.get("/all", (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  db("users")
    .offset(offset)
    .limit(limit)
    .orderBy("id", "desc")
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

router.get("/:id", (req, res) => {
  const id = req.params.id;
  db("users")
    .where({ id })
    .then(dbRes => {
      res.status(200).json(dbRes);
    })
    .catch(error => {
      const errObj = {
        error,
        message: error.message
      };
      console.log(JSON.stringify(errObj));
    });
});

module.exports = router;
