const logger = require("../logger")(module);
const mongoose = require("mongoose");

module.exports = () => {
  const uri = process.env.DB_URI;
  mongoose.set("useNewUrlParser", true);
  // mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
  mongoose.set("useUnifiedTopology", true);
  mongoose
    .connect(uri)
    .then(() => {
      logger.info("Successfully connected to Database");
    })
    .catch((err) => {
      logger.error(`Database connection error: ${err}`);
      // Mongo won't reconnect if this fails
    });
};
