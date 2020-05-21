const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception, shutting down process");
  console.log(err);
  process.exit(1);
});

dotenv.config();
const app = require("./createExpressApp")();

// Server Setup
const server = app.listen(process.env.PORT, process.env.IP, function () {
  console.log(
    `Server started in ${process.env.NODE_ENV} mode, listening on ${process.env.IP}:${process.env.PORT}`
  );
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection, shutting down process");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM recieved. Shutting down process gracefully");
  server.close(() => {
    console.log("Server closed gracefully");
  });
});
