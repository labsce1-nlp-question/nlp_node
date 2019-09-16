
exports.up = function(knex) {
  return knex.schema.table("feedback", feedback => {
    feedback.string("match_type", 100);
    feedback.string("similarity_metrics", 100);
  });
};

exports.down = function(knex) {
  if(knex.schema.hasColumn("feedback", "match_type") && knex.schema.hasColumn("feedback", "similarity_metrics")){
    return knex.schema.table("feedback", feedback => {
      feedback.dropColumn("match_type");
      feedback.dropColumn("similarity_metrics");
    })
  }
};
