const logger = require("../logger")(module);
const { Model } = require("objection");

module.exports = () => {
  // Initialize knex
  const environment = process.env.NODE_ENV || "development";
  const configuration = require("./knexfile")[environment];
  const db = require("knex")(configuration);

  db.transaction((trx) => {
    trx
      .raw("select * from users")
      .then(function () {
        logger.info("Valid connection to database.");
      })
      .catch((err) => console.log(err));
  });

  // Give the knex instance to objection.
  Model.knex(db);
};
