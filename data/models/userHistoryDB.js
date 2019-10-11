const db = require("../dbConfig.js");

const getAllUserHistory = (limit = 30, offset = 0) => {
  return db("user_history")
  .offset(offset)
  .limit(limit);
};

// get a user's history by their slack id
const getUserHistoryById = async (user_id, limit = 30, offset = 0) => {
  const user_history = await db("user_history")
    .where({ user_id })
    .offset(offset)
    .limit(limit)
    .orderBy("time", "desc");

  // Uncomment if the need to remove the same question asked from the user's search history
  // let res = [];
  // for(let i = 0; i < user_history.length; i++){

  //   if(i > 0 && user_history[i-1].question === user_history[i].question) continue;
    
  //   res.push(user_history[i]);
  // }

  return user_history;
};

const getHistoryById = async (id, slack_id)=> {
  const user_history = await db("user_history").where({ id }).first();
  
  // check to verify that the user requesting this data is the same
  if(user_history){
    if(user_history.user_id === slack_id){
      return user_history;
    } else {
      return -1;
    }
  } else {
    return user_history;
  }
}

// get a users notes by their slack id, will only return a list of history they added notes to
const getUserNotes = async user_id => {

  const user_history = await db("user_history")
    .where({ user_id })
    .orderBy("time", "desc");

  return user_history.filter(history => history.notes);
};

const addUserHistory = async (user_id, question, bot_response) => {
  await db("user_history").insert({ user_id, question, bot_response });

  return getUserHistoryById(user_id);
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
      .update("time_updated_at", db.fn.now())
      .then(() => getHistoryById(id, slack_id));
  }
};

const deleteUserHistory = async (id, slack_id) => {
  const user_history = await getHistoryById(id, slack_id);

  if(user_history === -1){
    return -1;
  } else {
    return db("user_history")
      .where({ id })
      .del();
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
  deleteUserHistory
};