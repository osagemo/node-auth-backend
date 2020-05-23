const logger = require("../logger")(module);

const bcrypt = require("bcrypt");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");

const tokenForUser = (user) => {
  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, 10);

  if (await User.query().findOne({ email })) {
    return next(new AppError("Email is in use", 422));
  }

  const user = await User.query().insert({
    email: email,
    password: password,
  });

  res.json({ token: tokenForUser(user) });
});

exports.signin = catchAsync(async (req, res, next) => {
  // already authenticated by middleware, give user token
  logger.info(`User ${req.user.id} signed in`);
  res.json({ token: tokenForUser(req.user) });
});

exports.signout = catchAsync(async (req, res, next) => {
  const lastLogoutAtISO = new Date(Date.now()).toISOString();
  console.log("SETTING SIGNOUT AS ", lastLogoutAtISO);
  const updatedUser = await User.query()
    .findById(req.user.id)
    .patch({
      last_logout_at: lastLogoutAtISO,
    })
    .returning("*");
  console.log(updatedUser);

  logger.info(
    `User ${updatedUser.id} signed out, last logout: ${updatedUser.lastLogoutAt}`
  );
  res.json({ sucess: true });
});
