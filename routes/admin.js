const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');
var path = require('path');

// User model
const User = require("../models/User");
const Rsvp = require("../models/Rsvp");

router.get("/", (req, res) => {
  // res.render("login");
  res.sendFile(path.join(__dirname, "../pages", '/admin.html'));
});

router.post("/register", async (req, res) => {
  let { username, password } = req.body;

  const newUser = new User({ username, password });

  // Hash password
  await bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(newUser.password, salt, (error, hash) => {
      if (error) throw error;

      newUser.password = hash;
      
      newUser
        .save()
        .then(user => {
          console.log(user);
          res.status(200).json({ message: "Registration was successful." });
        })
        .catch(error => {
          console.error(error);
      })
    });
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  // If this function gets called, authentication was successful.

  Rsvp.find()
      .then(rsvp => {
        // `req.user` contains the authenticated user.
        res.status(200).json({ message: "ok", user: res.req.user, session: res.req.sessionID, rsvp });
      });
  
});

module.exports = router;
