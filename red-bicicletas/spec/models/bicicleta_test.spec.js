var mongoose = require("mongoose");
var Bicicleta = require("../../models/bicicleta");
var server = require("../../bin/www");
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // 10 seconds

describe("Testing Bicicletas", function () {
  /*beforeEach(function(done) {
        var mongoDB = '';
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

  describe("Bicicleta.createInstance", function () {
    it("crea una instancia de Bicicleta", function () {
      var bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -54.1]);

      expect(bici.code).toBe(1);
      expect(bici.color).toBe("verde");
      expect(bici.modelo).toBe("urbana");
      expect(bici.ubicacion[0]).toEqual(-34.5);
      expect(bici.ubicacion[1]).toEqual(-54.1);
    });
  });

  describe("Bicicleta.allBicis", function () {
    it("comienza vacia", function (done) {
      Bicicleta.allBicis()
        .exec()
        .then((bicis) => {
          expect(bicis.length).toBe(0);
          done();
        })
        .catch((err) => {
          console.error(err);
          done();
        });
    });
  });

  describe("Bicicleta.add", function () {
    it("agrega solo una bici", function (done) {
      var aBici = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });

      Bicicleta.add(aBici).then((result) => {
        Bicicleta.allBicis()
          .exec()
          .then((bicis) => {
            expect(bicis.length).toEqual(1);
            expect(bicis[0].code).toEqual(aBici.code);
            done();
          })
          .catch((err) => {
            console.error(err);
            done();
          });
      });
    });
  });

  describe("Bicicleta.findByCode", function () {
    it("debe devolver la bici con code 1", function (done) {
      Bicicleta.allBicis()
        .exec()
        .then((bicis) => {
          expect(bicis.length).toBe(0);

          var aBici1 = new Bicicleta({
            code: 1,
            color: "verde",
            modelo: "urbana",
          });
          Bicicleta.add(aBici1)
            .then((result) => {
              var aBici2 = new Bicicleta({
                code: 2,
                color: "rojo",
                modelo: "urbana",
              });
              Bicicleta.add(aBici2)
                .then((result) => {
                  Bicicleta.findByCode(1)
                    .exec()
                    .then((bici) => {
                      expect(bici.code).toBe(aBici1.code);
                      expect(bici.color).toBe(aBici1.color);
                      expect(bici.modelo).toBe(aBici1.modelo);
                      done();
                    })
                    .catch((err) => {
                      console.error(err);
                      done();
                    });
                })
                .catch((err) => {
                  console.error(err);
                  done();
                });
            })
            .catch((err) => {
              console.error(err);
              done();
            });
        })
        .catch((err) => {
          console.error(err);
          done();
        });
    }
    );
  }
  );

  describe()

});
