const { passwordChangedTrigger } = require("../knexfile");

exports.up = function (knex, Promise) {
  let createQuery = `CREATE TABLE users(
    id SERIAL PRIMARY KEY NOT NULL,
    email varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    password_changed_at TIMESTAMP,
    last_login_at TIMESTAMP,
    last_logout_at TIMESTAMP
  );`;
  return knex.raw(createQuery).then(() => knex.raw(passwordChangedTrigger));
};

exports.down = function (knex, Promise) {
  let dropQuery = `DROP TABLE users`;
  return knex.raw(dropQuery);
};
