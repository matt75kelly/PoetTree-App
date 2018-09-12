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

function buildNotes(comments, user){
  let notes = [];
  console.log(`Comment Parameter: ${JSON.stringify(comments[0])}`);
  for(let i = comments.length-1; i >0; i--){
    if(comments[i].is_private && comments[i].comment_author === user){
      notes.push(comments[i]);
    }
  }
  console.log(`Notes: ${notes}`);
  return notes;
}
module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    console.log(req.user);
    res.sendFile(path.join(__dirname, `../public/index.html`), err=>{
      if(err){
        console.log(err);
        throw new Error(`Error sending index.html page: ${err}`);
      }
    });
  });
  
  app.get("/login", (req, res)=>{
    console.log(req.user);
    res.sendFile(path.join(__dirname, `../public/login.html`), err=>{
      if(err){
        throw new Error(`Error sending login.html page: ${err}`);
      }
    });
  });

  app.get("/signup", function(req, res) {
    console.log(req.user);
    res.sendFile(path.join(__dirname, `../public/signup.html`), err=>{
      if(err){
        console.log(err);
        throw new Error(`Error sending signup.html page: ${err}`);
      }
    });
  });
  // Load user Profile page
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/users/:username', isLoggedIn, function(req, res) {
    db.Users.findOne({
      // attributes: [
      //   `Users.username`, `Users.email`, `Users.createdAt`,
      //   `favorites.poem_title`, `favorites.poem_author`,
      //   `comments.comment_title`, `comments.comment_body`, `comments.is_private`, `comments.createdAt`],
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
      console.log(user);
      res.render('userProfile', user);
    })
	});

	// logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

  // Load Search page
  app.get("/search",isLoggedIn, (req, res)=>{
    res.status(200);
    res.sendFile(path.join(__dirname, "../public/search.html"), err=>{
      if(err){
        throw new Error(`Could not retrieve search.html: ${err}`);
      }
    });
  });
  // Load Poem Profile Page
  app.get("/poems/:poemTitle/:poemAuthor", isLoggedIn, (req, res)=>{
    console.log("Entered Route");
    db.Poems.findOne({
      include: [
        {
           model: db.Comments,
          as: "comments"
         },{
           model: db.Ratings,
           as: "ratings"
         }],
      where: {
        title: req.params.poemTitle,
        author: req.params.poemAuthor
      },
      order: [
        [{ model: db.Comments, as: 'comments' }, 'createdAt', 'DESC']
      ]
    }).then(result=>{
      console.log(`Finished query`);
      let poem = {
        id: result.id,
        title: result.title,
        author: result.author,
        body: result.poem_lines.split("|"),
        notes: buildNotes(result.comments, req.user.username),
        favorites: result.favorites,
        comments: result.comments,
        ratings: result.ratings,
      };
      console.log("Rendering WebPage");
      console.log(poem);
      res.render('poemProfile', poem);
    }).catch(err=>{
      throw new Error(`Could not collect Poem Information: ${err}`);
    });
	});
};

