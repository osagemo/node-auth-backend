require("dotenv").config();
const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorHandler");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");

// DB - Separate to own file
const uri = process.env.DB_URI;
mongoose.set("useNewUrlParser", true);
// mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(uri)
  .then(() => {
    console.log("Successfully connected to Database");
  })
  .catch((err) => {
    console.log("Database connection error: ", err);
    // Mongo won't reconnect if this fails
  });
// Seed the database

// App Setup
app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*" }));
router(app);

// Maybe move this out
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});

// Error handling middleware
app.use(errorHandler);

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
