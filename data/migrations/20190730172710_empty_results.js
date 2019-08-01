
exports.up = function(knex) {
  return knex.schema.createTable("empty_results", err => {
    err.increments();
    err.timestamp("time", { useTx: false }).defaultTo(knex.fn.now());
    err.jsonb("data").notNullable();
    err.string("question").notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("empty_results");
};