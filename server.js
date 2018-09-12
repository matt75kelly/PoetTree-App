require("dotenv").config();
var express = require("express");
var session  = require('express-session');
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var passport = require("passport");
var app = express();
var db = require("./models");
var flash = require("connect-flash");
var PORT = process.env.PORT || 7070;
const uuid = require("uuid/v4");
const FileStore = require('session-file-store')(session);

// Middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  require('./config/passport')(db, passport); // pass passport for configuration
  var sess = {
    genid: (req) => {
      console.log('Inside the session middleware')
      console.log(req.sessionID)
      return uuid() // use UUIDs for session IDs
    },
    store: new FileStore(),
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {}
  }
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
  }
  app.use(session(sess));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app, passport);
require("./routes/htmlRoutes")(app, passport);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV == "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
