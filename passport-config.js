const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User model
const User = require("./models/User");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "username" }, (username, password, done) => {
      // Match user
      User.findOne({ username: username })
          .then(user => {
            if ( !user ) {
              return done(null, false, { message: "bad!" });
            }

            // Match password
            bcrypt.compare(password, user.password, (error, isMatch) => {
              if (error) {
                console.log(error);
                res.status(500).json({ message: error });
              }

              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "bad" });
              }
            });
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({ message: error });
          })
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    })
  });
}
