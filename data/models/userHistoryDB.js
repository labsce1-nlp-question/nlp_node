const db = require("../dbConfig.js");

const getAllUserHistory = (limit, offset) => {
  return db("user_history")
  .offset(offset)
  .limit(limit);
};

// get a user's history by their slack id
const getUserHistoryById = (user_id, limit = 20, offset = 0) => {
  return db("user_history")
    .where({ user_id })
    .offset(offset)
    .limit(limit)
    .orderBy("time", "desc");
};

const getHistoryById = async (id, slack_id)=> {
  const user_history = await db("user_history").where({ id }).first();
  
  // check to verify that the user requesting this data is the same
  if(user_history.user_id === slack_id){
    return user_history;
  } else {
    return -1;
  }
}

const addUserHistory = async (user_id, question, bot_response) => {
  await db("user_history").insert({ user_id, question, bot_response });

  return getUserHistoryById(user_id, 10);
};

// get a users notes by their slack id, will only return a list of history they added notes to
const getUserNotes = async user_id => {
  const user_history = await db("user_history").where({ user_id }).orderBy("time", "desc");

  return user_history.filter(history => history.notes);
};

const updateUserHistoryWithNote = async (id, slack_id, notes, title) => {
  // check to verify that the user requesting this data is the same
  const user_history = await getHistoryById(id, slack_id);
  
  if(user_history === -1){
    return -1;
  } else {
    return db("user_history")
      .where({ id })
      .update({ title, notes })
      .update("time_updated_at", db.fn.now());
  }
};

const deleteUserHistoryNote = async (id, slack_id) => {
  const user_history = await getHistoryById(id, slack_id);

  if(user_history === -1){
    return -1;
  } else {
    return db("user_history")
      .where({ id })
      .update({ notes: null });
  }
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
  getUserNotes,
  getHistoryById,
  addUserHistory,
  updateUserHistoryWithNote,
  deleteUserHistoryNote
};