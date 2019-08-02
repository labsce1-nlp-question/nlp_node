
exports.up = function(knex) {
  return knex.schema.createTable("users", u => {
    u.increments();
    u.string("slack_id").notNullable().unique();
    u.json("preferences");
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
