var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("POST /api/:userID/favorite", function() {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  it("should save a user's favorite", function(done) {
    // Create an object to send to the endpoint
    var reqBody = {
      poem_title: "Example_Poem",
      poem_author: "Poem Example",
    };
    // POST a user to attatch the favorite to
    request
      .post("/api/users")
      .send({
          username: "Example_User",
          email: "exampleUser@gmail.com"
      })
      .end(function(err, response){
    // POST the request body to the server
    request
      .post(`/api/${response.id}/favorite`)
      .send(reqBody)
      .end(function(err, res) {
        var responseStatus = res.status;
        var responseBody = res.body;

        // Run assertions on the response

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        expect(responseBody)
          .to.be.an("object")
          .that.includes(reqBody);

        // The `done` function is used to end any asynchronous tests
        done();
      });
    });
  });
});
