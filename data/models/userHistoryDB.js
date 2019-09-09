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
    .limit(limit)
    .orderBy("time", "desc");
};

const addUserHistory = async (user_id, question, bot_response) => {
  await db("user_history").insert({ user_id, question, bot_response });

  return getUserHistoryById(user_id);
};

const updateUserHistoryWithNote = (id, notes) => {
  return db("user_history")
    .where({ id })
    .update({ notes });
};

const deleteUserHistoryNote = id => {
  return db("user_history")
    .where({ id })
    .update({ notes: null });
}

// const deleteHistory = async () => {
//   // grabs all records that are more than 2 weeks old and deletes them
//   const remove = await db("user_history").whereRaw("time <= now() - ('2 WEEK'::INTERVAL)").del();
//   console.log(remove)
  
//   return null
// }

module.exports = {
  getAllUserHistory,
  getUserHistoryById,
  addUserHistory,
  updateUserHistoryWithNote,
  deleteUserHistoryNote
};