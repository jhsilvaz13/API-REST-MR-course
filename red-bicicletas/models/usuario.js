var mongoose = require('mongoose');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;


var usuarioSchema = new Schema({
    code: Number,
    nombre: String
});


usuarioSchema.statics.allUsuarios = function () {
    return this.find({});
}

usuarioSchema.statics.add = function (usuario) {
    return this.create(usuario);
}

usuarioSchema.methods.reservar = function (biciId, desde, hasta) {
    var reserva = new Reserva({ usuario: this.id, bicicleta: biciId, desde: desde, hasta: hasta });
    return reserva.save();
}

usuarioSchema.statics.findByCode = function (aCode) {
    return this.findOne({ code: aCode });
}

module.exports = mongoose.model('Usuario', usuarioSchema);
