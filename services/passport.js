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
};

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      user
        .comparePassword(password)
        .then((isMatch) => {
          if (isMatch) {
            user.lastLoginAt = Date.now() - 1000;
            user.save();
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => {
          return done(err);
        });
    })
    .catch((err) => {
      done(err, false);
    });
});

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  const { sub, iat } = payload;
  // Check if user still exists
  User.findById(sub)
    .then((user) => {
      // Check if user has changed password or logged out since token was issued as a method of invalidating tokens
      if (
        user &&
        timestampAfterDate(iat, user.passwordChangedAt) &&
        timestampAfterDate(iat, user.lastLogoutAt)
      ) {
        user.lastLoginAt = Date.now() - 1000;
        // No callback, no promise?
        user.save().then(() => {
          done(null, user);
        });
      } else {
        done(null, false);
      }
    })
    .catch((err) => {
      done(err, false);
    });
});

function timestampAfterDate(iat, date) {
  if (date) {
    const numericDate = parseInt(date.getTime() / 1000, 10);
    return iat > numericDate;
  }
  return true;
}

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
