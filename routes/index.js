const express = require("express");
const router = express.Router();
var path = require('path');

// Rsvp model
const Rsvp = require("../models/Rsvp");

router.get("/", (req, res) => {
  res.render("frontpage");
  // res.sendFile(path.join(__dirname + "../" + 'public/pages/index.html'));
  // res.setHeader("Content-Security-Policy", "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content: *.mapbox.com *.gstatic.com *.google.com; script-src-elem 'self' *.mapbox.com; worker-src * 'self' http: blob: ; child-src * 'self' http: blob: ; img-src 'self' data: blob: ; connect-src * 'self' https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com");
  // res.sendFile(path.join(__dirname, "../pages", '/index.html'));
});

router.post("/rsvp", (req, res) => {
  let { name, response } = req.body;

  if (!name || !response) {
    res.status(500).json({ status: "FAIL", message: "Τα πεδία είναι υποχρεωτικά" });
    return;
  }

  name = name.trim();
  name = encodeURI(name);
  
  const newRsvp = new Rsvp({
    name,
    response,
    date: new Date()
  })

  newRsvp
    .save()
    .then(rsvp => {
      res.status(200).json({ status: "OK", message: "Η απάντηση σας εστάλη επιτυχώς! Σας ευχαριστούμε!", rsvp });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: error });
  })
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

module.exports = router;
