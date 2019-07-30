
exports.up = function(knex) {
  return knex.schema.createTable("empty_results", er => {
    er.increments();
    er.timestamp("time", { useTx: false }).defaultTo(knex.fn.now());
    er.jsonb("data")
    er.string("question")
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("empty_results");
};