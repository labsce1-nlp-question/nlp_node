
exports.up = function(knex) {
  return knex.schema.createTable("errors", e => {
    e.increments();
    e.timestamp("time", { useTx: false }).defaultTo(knex.fn.now());
    e.jsonb("body")
    e.jsonb("error")
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("errors");
};
