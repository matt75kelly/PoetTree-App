var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("GET /api/poem", function() {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  it("should find all poems matching query results", function(done) {
    // Add some examples to the db to test with
    db.Poems.bulkCreate([
      {
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
    }
    ]).then(function() {
      // Request the route that returns all examples
      request.get("/api/poem/Second_Poem/Second_Poem_Author").end(function(err, res) {
        var responseStatus = res.status;
        var responseBody = res.body;

        // Run assertions on the response

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        expect(responseBody)
          .to.be.an("array")
          .that.has.lengthOf(1);

        expect(responseBody[0])
          .to.be.an("object")
          .that.includes({
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
        });

        // The `done` function is used to end any asynchronous tests
        done();
      });
    });
  });
});
