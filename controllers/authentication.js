const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");

const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user.id, iat: timestamp }, process.env.JWT_SECRET);
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
  res.json({ token: tokenForUser(req.user) });
});
