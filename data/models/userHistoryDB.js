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
  const [ count ] = await db("user_history").where({ user_id }).count();
  // if(count.count >= 50){
  //   deleteHistory(user_id);
  // }
  await db("user_history").insert({ user_id, question, bot_response });

  return getUserHistoryById(user_id);
};

//Work in progress
// const deleteHistory = async user_id => {
//   // const remove = await db("user_history").where({ user_id }).orderBy("time").del();
//   const remove = await db.raw(`DELETE FROM user_history WHERE user_id='${user_id}' IN (SELECT user_id='${user_id}' FROM user_history ORDER BY time LIMIT 1)`);
//   console.log(remove)
//   return remove
// }

module.exports = {
  getAllUserHistory,
  getUserHistoryById,
  addUserHistory,
};