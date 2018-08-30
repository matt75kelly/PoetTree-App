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

  it("should save a new poem", function(done) {
    // Create an object to send to the endpoint
    var reqBody = {
        title: "Epitaph. on Edmund Duke of Buckingham, Who Died in the Nineteenth Year of",
        author: "Alexander Pope",
        lines: [
            "HIS AGE, 1735.",
            "",
            "If modest youth, with cool reflection crown'd,",
            "And every opening virtue blooming round,",
            "Could save a parent's justest pride from fate,",
            "Or add one patriot to a sinking state;",
            "This weeping marble had not ask'd thy tear,",
            "Or sadly told how many hopes lie here!",
            "The living virtue now had shone approved,",
            "The senate heard him, and his country loved.",
            "Yet softer honours, and less noisy fame",
            "Attend the shade of gentle Buckingham:",
            "In whom a race, for courage famed and art,",
            "Ends in the milder merit of the heart;",
            "And chiefs or sages long to Britain given,",
            "Pays the last tribute of a saint to Heaven."
        ],
};

    // POST the request body to the server
    request
      .get(`/api/poem/${reqBody.title}/${reqBody.author}`)
      .send(reqBody)
      .end(function(err, res) {
        var responseStatus = res.status;
        var responseBody = res.body;

        // Run assertions on the response

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        expect(responseBody)
          .to.be.an("object")
          .that.includes({
            title: reqBody.title,
            author: reqBody.author,
            poem_lines: reqBody.lines.join(" ")
    });

        // The `done` function is used to end any asynchronous tests
        done();
      });
  });
});
