var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.status(200);
    res.send("index.html");
  });
  
  app.get("/:username", (req, res)=>{
    db.Users.findOne({
      where: {
        username: req.params.username
      }
    }).then(result=>{
      console.log(result);
      res.status(200);
      res.render("userProfile",{
        result
      });
    }).catch(err=>{
      res.status(404);
      throw new Error(`Can't Find User with username ${req.params.username}: ${err}`);
    })
  });
  app.get("/api/:userID/favorites", (req, res)=>{
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

  app.get("/api/:userID/ratings", (req, res)=>{
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

  app.get("/api/:poemTitle/ratings", (req, res)=>{
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
};
