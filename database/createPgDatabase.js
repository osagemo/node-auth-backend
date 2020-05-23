const logger = require("../logger")(module);
const { Model } = require("objection");

const types = require("pg").types;
const TIMESTAMPTZ_OID = 1184;
const TIMESTAMP_OID = 1114;
types.setTypeParser(TIMESTAMPTZ_OID, (val) => val);
types.setTypeParser(TIMESTAMP_OID, (val) => val);

module.exports = () => {
  // Initialize knex
  const environment = process.env.NODE_ENV || "development";
  const configuration = require("./knexfile")[environment];
  const db = require("knex")(configuration);

  db.transaction((trx) => {
    trx
      .raw("select * from users")
      .then(function () {
        console.log("Valid");
      })
      .catch((err) => console.log(err));
  });

  // Give the knex instance to objection.
  Model.knex(db);
};
