
exports.up = function(knex) {
  return knex.schema.createTable("test_log", log => {
    log.increments();
    log.timestamp("time", { useTx: false }).defaultTo(knex.fn.now());
    log.jsonb("data")
    log.string("question")
  })
};

exports.down = function(knex) {
  return knex.schama.dropTableIfExists("test_log");
};
