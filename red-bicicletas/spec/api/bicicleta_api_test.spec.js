var request = require("request");
var server = require("../../bin/www");

describe("Bicicleta API", () => {
  /*beforeEach(function(done) {
        var mongoDB = 'mongodb+srv://jhsilvaz:jhsilvaz@cluster0.sfarc4n.mongodb.net/';
        mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error: '));
        db.once('open', function() {
            console.log('We are connected to test database!');
            done();
        });
    });*/

  afterEach(function (done) {
    Bicicleta.deleteMany({})
      .exec()
      .then((success) => {
        console.log("Deleted successfully:", success);
        done();
      })
      .catch((err) => {
        console.error("Error deleting:", err);
        done();
      });
  });

  describe("GET BICICLETAS /", () => {
    it("Status 200", (done) => {
      request.get(
        "http://localhost:3000/api/bicicletas",
        (error, response, body) => {
          var result = JSON.parse(body);
          expect(response.statusCode).toBe(200);
          expect(result.bicicletas.length).toBe(0);
          done();
        }
      );
    });
  });

  describe("POST BICICLETAS /create", () => {
    it("Status 200", (done) => {
      var headers = { "content-type": "application/json" };
      var aBici =
        '{"code": 10, "color": "rojo", "modelo": "urbana", "lat": -34, "lng": -54}';
      request.post(
        {
          headers: headers,
          url: "http://localhost:3000/api/bicicletas/create",
          body: aBici,
        },
        (error, response, body) => {
          expect(response.statusCode).toBe(200);
          var bici = JSON.parse(body).bicicleta;
          expect(bici.color).toBe("rojo");
          expect(bici.ubicacion[0]).toBe(-34);
          expect(bici.ubicacion[1]).toBe(-54);
          done();
        }
      );
    });
  });
});
