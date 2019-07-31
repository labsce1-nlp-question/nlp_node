
exports.up = function(knex) {
  return knex.schema.createTable("feedback", fb => {
    fb.increments();
    fb.timestamp("time", { useTx: false }).defaultTo(knex.fn.now());
    fb.text("question").notNullable();
    fb.jsonb("bot_response").notNullable();
    fb.boolean("user_response").notNullable();
    fb.jsonb("body").notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("feedback");
};
