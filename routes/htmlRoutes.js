var db = require("../models");
var path = require("path");
// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()){
    console.log("isAuthenticated: Passed");
		return next();
  }
	// if they aren't redirect them to the home page
	res.redirect('/');
}

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    console.log(req.user);
    res.sendFile(path.join(__dirname, `../public/index.html`), err=>{
      if(err){
        console.log(err);
        throw new Error(`Error sending HTML page: ${err}`);
      }
    });
  });

  app.get("/login", (req, res)=>{
    console.log(req.user);
    res.sendFile(path.join(__dirname, `../public/login.html`), err=>{
      if(err){
        throw new Error(`Error sending HTML page: ${err}`);
      }
    });
  });
  // Load user Profile page
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/users/:username', isLoggedIn, function(req, res) {
    db.Users.findOne({
      attribure: [
        `Users.id`, `Users.username`, `Users.email`, `Users.createdAt`,
        `favorites.poem_title`, `favorites.poem_author`,
        `comments.comment_title`, `comments.comment_body`, `comments.is_private`, `comments.comment.createdAt`],
      include: [
        {
          model: db.Favorites,
          as: "favorites"
         },
         {
          model: db.Comments,
          as: "comments"
         }],
      where: {
        username: req.user.username,
        email: req.user.email
      }
    }).catch(err=>{
      throw new Error(`Could not find User Information: ${err}`);
    }).then(result=>{
      let user = {
        username: result.username,
        email: result.email,
        favorites: result.favorites,
        comments: result.comments
      };
      res.render('userProfile', user);
    })
	});

	// logout
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
      include: [
        {
          model: db.Favorites,
          as: "favorites"
         },{
           model: db.Comments,
          as: "comments"
         },{
           model: db.Ratings,
           as: "ratings"
         }],
      where: {
        title: req.params.poemTitle,
      }
    }).catch(err=>{
      throw new Error(`Could not collect Poem Information: ${err}`);
    }).then(result=>{
      let poem = {
        title: result.title,
        author: result.author,
        favorites: result.favorites,
        comments: result.comments,
        ratings: result.ratings,
      };
      res.render('poemProfile', poem);
    })
	});
};

