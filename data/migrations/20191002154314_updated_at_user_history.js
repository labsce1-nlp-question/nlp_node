
exports.up = function(knex) {
  return knex.schema.table("user_history", history => {
    history.timestamp("time_updated_at",{ useTx: false });
    history.string("title");
  });
};

exports.down = function(knex) {
  if(knex.schema.hasColumn("user_history", "time_updated_at") && knex.schema.hasColumn("user_history", "title")){
    return knex.schema.table("user_history", history => {
      history.dropColumn("time_updated_at");
      history.dropColumn("title");
    })
  }
};
