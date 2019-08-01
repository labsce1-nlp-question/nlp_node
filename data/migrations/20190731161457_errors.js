
exports.up = function(knex) {
  return knex.schema.createTable("errors", e => {
    e.increments();
    e.timestamp("time", { useTx: false }).defaultTo(knex.fn.now());
    e.jsonb("body").notNullable();
    e.jsonb("error").notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("errors");
};
