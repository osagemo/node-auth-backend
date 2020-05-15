const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "You must provide an email"],
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: [true, "You must provide a password"] },
});

// On save hook, encrypt password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = model("User", userSchema);
// const ModelClass = model("User", userSchema);

module.exports = User;
