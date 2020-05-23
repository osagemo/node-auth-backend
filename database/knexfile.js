module.exports = {
  development: {
    client: "pg",
    connection: "postgres://user:secret@localhost:5432/auth",
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds/dev",
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: function (connection, callback) {
        connection.query("SET timezone = UTC;", function (err) {
          callback(err, connection);
        });
      },
    },
  },

  test: {
    client: "pg",
    connection: "postgres://user:secret@localhost:5432/auth",
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds/test",
    },
    useNullAsDefault: true,
  },

  production: {
    client: "pg",
    connection: process.env.DB_URI,
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds/production",
    },
    useNullAsDefault: true,
  },

  passwordChangedTrigger: `
    CREATE TRIGGER password_changed
    BEFORE UPDATE ON users
    FOR EACH ROW
    WHEN (OLD.password IS DISTINCT FROM NEW.password)
    EXECUTE FUNCTION update_password_timestamp();
  `,
};
