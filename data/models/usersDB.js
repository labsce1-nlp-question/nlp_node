const db = require("../dbConfig.js");

const getUsers = (offset, limit) => {
  return db("users")
    .offset(offset)
    .limit(limit)
    .orderBy("id", "desc")
};

const getUserById = id => {
  return db("users")
    .where({ id })
    .first();
}
const getUserBySlackId = slack_id => {
  return db("users")
    .where({ slack_id })
    .first();
    
};

const addUser = async (slack_id, preferences) => {
  await db("users").insert({ slack_id, preferences });

  return getUserById(slack_id);
};


module.exports = {
  getUsers,
  getUserBySlackId,
  getUserById,
  addUser
};