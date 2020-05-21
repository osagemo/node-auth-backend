const logger = require("../logger")(module);
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
  const password = req.body.password;

  if (await User.exists({ email: email })) {
    return next(new AppError("Email is in use", 422));
  }

  const user = await User.create({
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
  const user = req.user;
  user.lastLogoutAt = Date.now() - 1000;
  await user.save();
  logger.info(`User ${user._id} signed out, last logout: ${user.lastLogoutAt}`);
  res.json({ sucess: true });
});
