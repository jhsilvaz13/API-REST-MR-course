var Bicicleta = require("../../models/bicicleta");
var Usuario = require("../../models/usuario");
var Reserva = require("../../models/reserva");
var server = require("../../bin/www");
var mongoose = require("mongoose");

describe("Testing Usuarios", function () {
  /*
  beforeEach(function (done) {
        var mongoDB = '';
        mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error: '));
        db.once('open', function () {
            console.log('We are connected to test database!');
            done();
        });
    }
    );
  */
  afterEach(function (done) {
    Reserva.deleteMany({})
      .exec()
      .then((success) => {
        console.log("Reservas deleted successfully:", success);
        Usuario.deleteMany({})
          .exec()
          .then((success) => {
            console.log("Usuarios deleted successfully:", success);
            Bicicleta.deleteMany({})
              .exec()
              .then((success) => {
                console.log("Bicicletas deleted successfully:", success);
                done();
              })
              .catch((err) => {
                console.error(err);
                done();
              });
          });
      })
      .catch((err) => {
        console.error(err);
        done();
      });
  });

  describe("Cuando un Usuario reserva una bici", () => {
    it("debe existir la reserva", (done) => {
      var usuario = new Usuario({ nombre: "Jorge" });
      Usuario.add(usuario).then((usuario) => {
        Bicicleta.add({
          code: 1,
          color: "verde",
          modelo: "urbana",
        }).then((bicicleta) => {
          var hoy = new Date();
          var mañana = new Date();
          mañana.setDate(hoy.getDate() + 1);
          usuario.reservar(bicicleta.id, hoy, mañana).then((reserva) => {
            Reserva.find({})
              .populate("bicicleta")
              .populate("usuario")
              .exec()
              .then((reservas) => {
                console.log(reservas[0]);
                expect(reservas.length).toBe(1);
                expect(reservas[0].diasDeReserva()).toBe(2);
                expect(reservas[0].bicicleta.code).toBe(1);
                expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                done();
              });
          });
        });
      });
    });
  });
});
