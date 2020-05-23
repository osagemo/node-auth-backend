const logger = require("../logger")(module);
const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const localOptions = {
  usernameField: "email",
};

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  iat: Math.floor(Date.parse(new Date().toISOString()) / 1000),
};

const localLogin = new LocalStrategy(
  localOptions,
  async (email, password, done) => {
    try {
      const user = await User.query().findOne({ email });
      if (!user) {
        return done(null, false);
      }

      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        logger.info("Password Match");

        const lastLoginAtISO = new Date(Date.now()).toISOString();
        const updatedUser = await User.query()
          .findById(user.id)
          .patch({
            last_login_at: lastLoginAtISO,
          })
          .returning("*");
        return done(null, updatedUser);
      }
    } catch (err) {
      return done(err, false);
    }
  }
);

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const { sub, iat } = payload;
    const user = await User.query().findById(sub);
    if (
      user &&
      timestampAfterDate(iat, user.password_changed_at) &&
      timestampAfterDate(iat, user.last_logout_at)
    ) {
      const lastLoginAtISO = new Date(Date.now()).toISOString();
      const updatedUser = await User.query()
        .findById(user.id)
        .patch({
          last_login_at: lastLoginAtISO,
        })
        .returning("*");

      return done(null, updatedUser);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, false);
  }
});

function timestampAfterDate(iat, date) {
  console.log("comparing", new Date(iat * 1000), date);

  if (date) {
    const numericDate = Math.floor(Date.parse(date) / 1000);
    console.log("comparing", iat, numericDate);
    console.log(iat > numericDate);

    return iat > numericDate;
  }
  return true;
}

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);

module.exports = passport;
