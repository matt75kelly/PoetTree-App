require("dotenv");
var db = require("../models");
const request = require("request");

module.exports = function(app) {
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
  app.get("/api/poem/:poemTitle/:poemAuthor", (req,res)=>{
    let searchQuery = `title,author`;
    let queries = `${req.params.poemTitle};${req.params.poemAuthor}`;
    let url = `${process.env.API_BASE_URL}/${searchQuery}/${queries}`;
    request(url, (err, response)=>{
      if(err || response.statusCode !== 200){
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
            lines: poem[0].lines.join(" ")
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
    console.log(req.params.userID);
    console.log(req.body);
    let newFavorite = {
      poem_title: req.body.poem_title,
      poem_author: req.body.poem_author,
      UserId: req.params.userID
    };
    db.Favorites.create(newFavorite).catch(err=>{
      throw new Error(`\nCannot add to Favorites List: ${err}`);
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
        PoemId: result.id,
        UserId: req.params.userID, 
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