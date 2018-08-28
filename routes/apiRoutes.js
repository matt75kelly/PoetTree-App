var db = require("../models");
const request = require("request");

module.exports = function(app) {
  // Route for Poem retrieval
  app.get("/api/poems/:poemTitle?/:poemAuthor?/:poemQuery", (req, res)=>{

  });
  // Route for Creating New User Profiles
  app.post("/api/users", (req, res)=>{
    db.Users.findOrCreate({
      where: {
        email: req.body.email
      },
      defaults: {
        username: req.body.username
      }
    }).spread((user, created)=>{
      if(created){
        res.status(200);
        res.json(user);
      } else{
        res.status(500);
        res.send("Error creating new User Profile, User Already created");
      }
    }).catch(err=>{
      throw new Error(`Error Creating New User: ${err}`);
    });
  });
  // Route for Creating New Favorite for a User Profile
  app.post("/api/:userID/favorite", (req, res)=>{
    let newFavorite = {
      poem_title: req.body.poemTitle,
      poem_author: req.body.poemAuthor,
      UsersId: req.params.userID
    };
    db.Favorites.create(newFavorite).catch(err=>{
      throw new Error(`\nCannout add to Favorites List: ${err}`);
    }).then((result)=>{
      console.log(result);
      res.json(result);
    });
  });
  // Route for Creating New Rating for a User Profile
  app.post("/api/:userID/:poemTitle/rating", (req, res)=>{
    db.Poems.findOne({
      attributes: [id. poem_title, poem_author],
      where: {
        poem_title: req.params.poemTitle,
        poem_author: req.body.poemAuthor
      }
    }).catch(err=>{
      throw new Error(`Could not find Poem matching that Title: ${err}`);
    }).then(result=>{
      let newRating ={
      rating: req.body.rating,
      UsersId: req.params.userID,
      PoemsId: result.id
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
  app.post("/api/:userID/:poemTitle/comment", (req, res)=>{
    db.Poems.findOne({
      attributes: [id. poem_title, poem_author],
      where: {
        poem_title: req.params.poemTitle,
        poem_author: req.body.poemAuthor
      }
    }).catch(err=>{
      throw new Error(`Could not find Poem matching that Title: ${err}`);
    }).then(result=>{
      let newComment = {
        comment_body: res.body.comment,
        PoemsId: result.id,
        UsersId: req.params.userID, 
        is_private: res.body.private
      };
      db.Comments.create(newComment).catch(err=>{
        throw new Error(`Could not Save New Comment for Poem: ${req.params.poemTitle}: ${err}`);
      }).then(result=>{
        console.log(result);
        res.json(result);
      })
    });
  })
};