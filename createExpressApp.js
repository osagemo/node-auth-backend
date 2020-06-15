const express = require("express");
const databaseErrorHandler = require("./controllers/databaseErrorHandler");
const errorHandler = require("./controllers/errorHandler");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./router");
const app = express();

module.exports = () => {
  require("./database/createPgDatabase")();

  // MiddleWare
  app.use(morgan("combined"));
  app.use(bodyParser.json({ type: "*/*" }));

  // Routes
  router(app);

  // Error handling middleware (after routes)
  app.use(databaseErrorHandler);
  app.use(errorHandler);

  return app;
};
