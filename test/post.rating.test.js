var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("POST /api/:userID/:poemID/ratings", function() {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  it("should add a user's rating to a poem", function(done) {
    // Create an object to send to the endpoint
    
    let newuser = {
        email: "example_user@email.com",
        username: "Example_User"
    };
    let newpoem = {
        title: "Epitaph",
        author: "Alexander Pope",
        lines: "HIS AGE, 1735. If modest youth, with cool reflection crown'd"
    };
    var reqBody = {
      rating: 5,
      poemTitle: newpoem.title,
      poemAuthor: newpoem.author
    };
      db.Users.create(newuser);
      db.Poems.create(newpoem);
    // POST the request body to the server
    request
      .post(`/api/1/rating`)
      .send(reqBody)
      .end(function(err, res) {
        var responseStatus = res.status;
        var responseBody = res.body;

        // Run assertions on the response

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        expect(responseBody)
          .to.be.an("object")
          .that.includes(
              {
                  rating: 5,
                  UserId: 1
              }
          );

        // The `done` function is used to end any asynchronous tests
        done();
      });
    });
  });
