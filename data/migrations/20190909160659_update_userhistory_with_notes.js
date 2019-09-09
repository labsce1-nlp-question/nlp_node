
exports.up = function(knex) {
  return knex.schema.table("user_history", history => {
    history.text("notes");
  });
};

exports.down = function(knex) {
  if(knex.schema.hasColumn("notes", "user_history")){
    return knex.schema.table("notes", history => {
      history.dropColumn("user_history");
    })
  }
};