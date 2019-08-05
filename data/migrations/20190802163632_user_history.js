
exports.up = function(knex) {
  return knex.schema.createTable("user_history", history => {
    //reference key to users table
    history
      .string("user_id")
      .unsigned()
      .notNullable()
      .references("slack_id")
      .inTable("users")
      .onDelete("CASCADE");

    history.text("question");
    history.json("bot_response");
    history.timestamp("time", { useTx: false }).defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("user_history");
};
