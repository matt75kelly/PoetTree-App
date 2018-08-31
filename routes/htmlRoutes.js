var db = require("../models");
var path = require("path");
// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    console.log(req.user);
    var options = {
      root: path.join(__dirname + `../public/`),
      dotfiles: 'deny',
      headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
      }
    };
    res.sendFile("index.html", options, err=>{
      if(err){
        console.log(err);
        throw new Error(`Error sending HTML page: ${err}`);
      }
    });
  });

  app.get("/login", (req, res)=>{
    console.log(req.user);
    var options = {
      root: path.join(__dirname, `../public/`),
      dotfiles: 'deny',
      headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
      }
    };
    res.sendFile("login.html", options, err=>{
      if(err){
        throw new Error(`Error sending HTML page: ${err}`);
      }
    });
  })
  // Load user Profile page
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('userProfile', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

  // Load Search page
  app.get("/search",(req, res)=>{
    res.status(200);
    res.send("search.html");
  });
  // Load Poem Profile Page
  app.get("/poems/:poemTitle", (req, res)=>{
    db.Poems.findOne({
      where: {
        title: req.params.poemTitle
      }
    }).catch(err=>{
      res.status(500);
      throw new Error(`Could not find poem with title ${req.params.poemTitle}: ${err}`);
    }).then(result=>{
      res.status(200);
      res.render("poemProfile", {
        result
      });
    })
  })
};

