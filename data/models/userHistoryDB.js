const db = require("../dbConfig.js");

const getAllUserHistory = (limit, offset) => {
  return db("user_history")
  .offset(offset)
  .limit(limit);
};

const getUserHistoryById = (user_id, limit = 20, offset = 0)=> {
  return db("user_history")
    .where({ user_id })
    .offset(offset)
    .limit(limit);
};

const addUserHistory = async (user_id, question, bot_response) => {
  await db("user_history").insert({ user_id, question, bot_response });

  return getUserHistoryById(user_id);
};

module.exports = {
  getAllUserHistory,
  getUserHistoryById,
  addUserHistory
};