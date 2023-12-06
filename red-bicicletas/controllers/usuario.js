var Usuario = require('../models/usuario');

module.exports = {
    list: function (req, res, next) {
        Usuario.find({})
        .exec()
        .then(usuarios => {
            res.render('usuarios/index', { usuarios: usuarios });
        })
    },
    update_get: function (req, res, next) {
        Usuario.findById(req.params.id)
        .exec()
        .then(usuario => {
            res.render('usuarios/update', { errors: {}, usuario: usuario });
        })
    },
    update: function (req, res, next) {
        var update_values = { nombre: req.body.nombre };
        Usuario.findByIdAndUpdate(req.params.id, update_values)
        .exec()
        .then(usuario => {
            res.render('usuarios', { errors: {}, usuario: usuario });
            return;
        })
        .catch(err => {
            res.render('usuarios/update', { errors: err.errors, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) });
        })
    },
    create_get: function (req, res, next) {
        res.render('usuarios/create', { errors: {}, usuario: new Usuario() });
    },
    create: function (req, res, next) {
        if (req.body.pws != req.body.confirm_pws) {
            console.log("Is here");
            res.render('usuarios/create', { errors: { confirm_password: { message: 'No coincide con el password ingresado' } }, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) });
            return;
        }
        Usuario.create({ nombre: req.body.nombre, email: req.body.email, password: req.body.password })
        .then(usuario => {
            res.redirect('/usuarios');
            return;
        })
        .catch(err => {
            res.render('usuarios/create', { errors: err.errors, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) });
        })
    },
    delete: function (req, res, next) {
        Usuario.findByIdAndDelete(req.body.id)
        .exec()
        .then(() => res.redirect('/usuarios'))
        .catch(err => next(err));
    }
};