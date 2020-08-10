const express = require("express");
const helmet = require("helmet");
// const minify = require("express-minify");
const compression = require("compression")
const expressLayouts = require("express-ejs-layouts");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser= require("body-parser");
const session = require('express-session');
const passport = require("passport");

const app = express();

// DB Config
const db = process.env.DB;

// Passport
require("./passport-config")(passport);

// DB Connection
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB Connected!"))
  .catch(error => console.log(error))

app.use(helmet());
app.disable("x-powered-by");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// EJS
app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(express.static(__dirname + '/public/'));
// app.use(minify({
//   js_match : /\.js$/,
//   css_match : /\.css$/
// }));
// app.use(express.static(__dirname + "/public"));

// Routes
app.use("/", require("./routes/index"));
app.use("/admin", require("./routes/admin"));

const PORT = process.env.PORT || 5000;
const URI = process.env.URI || "http://localhost"

app.listen(PORT, console.log(`Up and running on ${URI}:${PORT}`));
