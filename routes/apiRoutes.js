require("dotenv");
var db = require("../models");
const request = require("request");

module.exports = function(app, passport) {
  function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
      return next();
  
    // if they aren't redirect them to the home page
    res.redirect('/');
  };
  // Route for Poem Search List
  app.get("/api/poems/:poemQuery/:poemTitle?/:poemAuthor?", (req, res)=>{
    let searchQuery = `lines`;
    let queries = `${req.params.poemQuery}`;
    let urlTrailer = `author,title`;

    if(req.params.poemAuthor){
      searchQuery += `,author`;
      queries += `;${req.params.poemAuthor}`;
    }
    if(req.params.poemTitle){
      searchQuery += `,title`;
      queries += `;${req.params.poemTitle}`;
    }
    let url = `${process.env.API_BASE_URL}/${searchQuery}/${queries}/${urlTrailer}`;
    console.log(`API URL: ${url}`);
    request(url, (err, response)=>{
      if(err || response.statusCode !== 200){
        throw new Error(`Could not retrieve Poem Search Results: ${err}`);
      }
      else{
        let results = JSON.parse(response.body);
        res.status(200);
        res.json(results);
      }
    });
  });
  // Route for Pulling a Single Poem
  // This may need to go into the html routes?
  app.post("/api/poem/:poemTitle/:poemAuthor", (req,res)=>{
    let searchQuery = `title,author`;
    let queries = `${req.params.poemTitle};${req.params.poemAuthor}`;
    let url = `${process.env.API_BASE_URL}/${searchQuery}/${queries}`;
    request(url, (err, response)=>{
      if(err){
        throw new Error(`Could not retrieve Poem from API: ${err}`);
      }
      else{
        let poem = JSON.parse(response.body);
        db.Poems.findOrCreate({
          where: {
            title: poem[0].title,
            author: poem[0].author
          },
          defaults: {
            poem_lines: poem[0].lines.join("|")
          }
        }).spread((sonnet, created)=>{
          if(created){
            console.log("New Poem added to Database");
          }
            res.status(200);
            res.json(sonnet);
        }).catch(err=>{
          throw new Error(`Error Creating New User: ${err}`);
        });
      }
    })
  })
  app.get("/api/:userID/favorites", isLoggedIn, (req, res)=>{
    db.Favorites.findAll({
      attributes: ["poem_title", "poem_author"],
      where: {
        UserId: req.params.userID,
      },
    }).then(function(results){
      res.status(200);
      res.json(results);
    }).catch(err=>{
      throw new Error(``);
    });
  });

  app.get("/api/:userID/ratings", isLoggedIn, (req, res)=>{
    db.Ratings.findAll({
      attributes: ["rating", "poem_title", "poem_author"],
      where: {
        UserId: req.params.userID,
      },
    }).then(function(results){
      res.status(200);
      res.json(results);
    });
  });

  app.get("/api/:poemTitle/ratings", isLoggedIn, (req, res)=>{
    db.Poems.findOne({
      attributes: ["id", "title", "author"],
      where: {
        title: req.params.poemTitle
      }
    }).then(function(result){
      db.Ratings.findAll({
      attributes: ["rating"],
      where: {
        PoemId: result.id
      }
      }).then(function(results){
        res.status(200);
        res.json(results);
      });
    });    
  });
  // Route for Creating New Favorite for a User Profile
  app.post("/api/:userID/favorite", isLoggedIn, (req, res)=>{
    let newFavorite = {
      poem_title: req.body.poem_title,
      poem_author: req.body.poem_author,
      UserId: req.params.userID
    };
    db.Favorites.create(newFavorite).catch(err=>{
      res.status(500);
      throw new Error(`\nCannot add to Favorites List: ${err}`);
    }).then((result)=>{
      console.log(result);
      res.json(result);
    });
  });
  // Route for Creating New Rating for a User Profile
  app.post("/api/:userID/rating", isLoggedIn, (req, res)=>{
    db.Poems.findOne({
      attributes: ["id"],
      where: {
        title: req.body.poemTitle,
        author: req.body.poemAuthor
      }
    }).catch(err=>{
      throw new Error(`Could not find Poem matching that Title: ${err}`);
    }).then(result=>{
      console.log(result);
      let newRating ={
      rating: req.body.rating,
      UserId: req.params.userID,
      PoemId: result.id
    };
    db.Ratings.create(newRating).catch(err=>{
      throw new Error(`\nCouldn't Save New Rating for ${req.params.poemTitle}: ${err}`);
    }).then((results)=>{
      console.log(results);
      res.json(results);
    });
    });
  });
  // Route for Creating New User Comments on a Poem
  app.post("/api/comments", isLoggedIn, (req, res)=>{
    let newComment = {
      comment_title: req.body.title,
      comment_author: req.user.username,
      comment_body: req.body.body,
      is_private: req.body.private,
      PoemId: req.body.poemID,
      UserId: req.user.id
    }
      db.Comments.create(newComment).catch(err=>{
        throw new Error(`Could not Save New Comment for Poem: ${req.params.poemTitle}: ${err}`);
      }).then(result=>{
        console.log(result);
        res.json(result);
      })
    });
  // Creating a new User and Logging them in
  app.post('/signup', (req, res, next) => {
    console.log('Inside POST /signin callback')
    passport.authenticate('local-signup', (err, user, info) => {
      console.log('Inside passport.authenticate() callback');
      console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`)
      req.login(user, err=> {
        console.log('Inside req.login() callback')
        console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
        console.log(`req.user: ${JSON.stringify(req.user)}`)
        res.status(200).json(req.user.username);
      });
    })(req, res, next);
  })

  app.post('/login', (req, res, next)=>{
    console.log('Inside POST /signin callback')
    passport.authenticate('local-signup', (err, user, info) => {
        console.log('Inside passport.authenticate() callback');
        console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
        console.log(`req.user: ${JSON.stringify(req.user)}`)
        req.login(user, (err) => {
            console.log('Inside req.login() callback')
            console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
            console.log(`req.user: ${JSON.stringify(req.user)}`)
            res.status(200).json(req.user);
        });
    })(req, res, next);
  });
}