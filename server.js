const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception, shutting down process");
  logger.error(err);
  process.exit(1);
});

dotenv.config();
const logger = require("./logger")(module);
const app = require("./createExpressApp")();
const server = app.listen(process.env.PORT, process.env.IP, function () {
  logger.info(
    `Server started in ${process.env.NODE_ENV} mode, listening on ${process.env.IP}:${process.env.PORT}`
  );
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection, shutting down process");
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM recieved. Shutting down process gracefully");
  server.close(() => {
    logger.info("Server closed gracefully");
  });
});
