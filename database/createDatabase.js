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
      console.log("Successfully connected to Database");
    })
    .catch((err) => {
      console.log("Database connection error: ", err);
      // Mongo won't reconnect if this fails
    });
};
