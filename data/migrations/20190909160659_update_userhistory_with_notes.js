
exports.up = function(knex) {
  return knex.schema.table("user_history", history => {
    history.text("notes");
    history.increments();
  });
};

exports.down = function(knex) {
  if(knex.schema.hasColumn("user_history", "notes")){
    return knex.schema.table("user_history", history => {
      history.dropColumn("notes");
    })
  }
};