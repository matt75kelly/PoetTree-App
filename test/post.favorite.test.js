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
      db.Users.bulkCreate([
        {
          email: "example_user@email.com",
          username: "Example_User"
      }]);
    // POST the request body to the server
    request
      .post(`/api/1/favorite`)
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
