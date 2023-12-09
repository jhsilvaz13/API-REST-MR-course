var mongoose = require('mongoose');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var crypto = require('crypto');
const saltRounds = 10;

const Token = require('../models/token');
const mailer = require('../mailer/mailer');

const validateEmail = function (email) {
    const re = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return re.test(email)
}

var usuarioSchema = new Schema({
    code: Number,
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        unique: true,
        validate:[validateEmail, 'Por favor, ingrese un email valido'],
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Por favor, ingrese un email valido']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
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

usuarioSchema.methods.validPassword = function (aPassword) {
    return bcrypt.compareSync(aPassword, this.password);
}

usuarioSchema.methods.enviar_email_bienvenida = function () {
    const token= new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    console.log("email_destination: " + email_destination);
    token.save()
    .then(() => {
        const mailOptions = {
            from: 'no-reply@red-bicicletas.com',
            to: email_destination,
            subject: 'Verificacion de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para verificar su cuenta haga click en este link: \n' + 'http://localhost:3000' + '/token/confirmation/' + token.token + '\n'
        };
        mailer.sendMail(mailOptions, function (err) {
            if (err) { return console.log(err.message); }
            console.log('Se ha enviado un email de bienvenida a: ' + email_destination + '.');
        });

    })
    .catch(err => console.log(err.message));
}

usuarioSchema.methods.forgotPassword = function (aEmail) {
    const token= new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = aEmail;
    token.save()
    const mailOptions = {
        from: 'no-reply@red-bicicletas.com',
        to: email_destination,
        subject: 'Reseteo de password de cuenta',
        text: 'Hola,\n\n' + 'Por favor, para resetear el password de su cuenta haga click en este link: \n' + 'http://localhost:3000' + '/session/resetPassword/' + token.token + '\n'
    };
    mailer.sendMail(mailOptions, function (err) {
        if (err) { return console.log(err.message); }
        console.log('Se ha enviado un email de reseteo de password a: ' + email_destination + '.');
    });
}


usuarioSchema.statics.login = function (email, password) {
    return this.findOne({ email: email }).then(function (user) {
        if (!user) return null;
        if (!user.validPassword(password)) return null;
        return user;
    });
}

usuarioSchema.statics.resetPassword = function (_userId,newPassword) {
    var usuario = this.findById(_userId);
    this.findOneAndUpdate( {_id: _userId}, {password: newPassword});
    return usuario;
}



module.exports = mongoose.model('Usuario', usuarioSchema);
