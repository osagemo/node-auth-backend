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
          if (!isMatch) {
            return done(null, false);
          }
          return done(null, user);
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
  User.findById(payload.sub)
    .then((user) => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
    .catch((err) => {
      done(err, false);
    });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
