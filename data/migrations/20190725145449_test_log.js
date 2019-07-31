
exports.up = function(knex) {
  return knex.schema.createTable("test_log", log => {
    log.increments();
    log.timestamp("time", { useTx: false }).defaultTo(knex.fn.now());
    log.jsonb("data").notNullable();
    log.string("question").notNullable();
  })
};

exports.down = function(knex) {
  return knex.schama.dropTableIfExists("test_log");
};
