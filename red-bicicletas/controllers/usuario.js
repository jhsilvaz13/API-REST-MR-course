var Usuario = require('../models/usuario');
var Token = require('../models/token');
var passport = require('passport');

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
            res.render('/usuarios', { errors: {}, usuario: usuario });
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
            res.render('usuarios/create', { errors: { confirm_password: { message: 'No coincide con el password ingresado' } }, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) });
            return;
        }
        Usuario.create({ nombre: req.body.nombre, email: req.body.email, password: req.body.password })
        .then(usuario => {
            usuario.enviar_email_bienvenida();
            res.redirect('/usuarios');
            return;
        })
        .catch(err => {
            console.log(err.message);
            res.render('usuarios/create', { errors: err.errors, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) });
        })
    },
    delete: function (req, res, next) {
        Usuario.findByIdAndDelete(req.body.id)
        .exec()
        .then(() => res.redirect('/usuarios'))
        .catch(err => next(err));
    },
    login_get: function (req, res, next) {
        res.render('session/login', { errors: {} });
    },
    login: function(req,res,next){
        passport.authenticate('local', function(err,usuario,info){
            if (err) return next(err);
            if (!usuario) return res.render('session/login', {info});
            req.logIn(usuario, function(err){
                if (err) return next(err);
                return res.redirect('/');
            });
        }
        )(req,res,next);
    },
    logout: function(req,res,next){
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
          });
    },
    forgotPassword_get: function(req,res,next){
        res.render('session/forgotPassword', { errors: {} });
    },
    forgotPassword: function(req,res,next){
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/session/login',
        })
    },
    resetPassword_get: function(req,res,next){
        Token.findOne({token: req.params.token})
        .then(token => {
            if (!token) return res.status(400).send({type: 'not-verified', msg: 'No existe un usuario asociado al token. Verifique que su token no haya expirado'});
            Usuario.findById(token._userId)
            .then(usuario => {
                if (!usuario) return res.status(400).send({msg: 'No existe un usuario asociado al token.'});
                res.render('session/resetPassword', {errors: {}, usuario: usuario});
            }).catch(err => {
                res.status(500).send({msg: err.message});
            });
        }
        ).catch(err => {
            res.status(500).send({msg: err.message});
        });
    },
    resetPassword: function(req,res,next){
        Usuario.findOne({email: req.body.email})
        .then(usuario => {
            if (!usuario) return res.status(400).send({msg: 'No existe un usuario asociado al email.'});
            usuario.password = req.body.password;
            usuario.save()
            .then(() => {
                res.redirect('/session/login');
            }).catch(err => {
                res.render('session/resetPassword', {errors: err.errors, usuario: new Usuario({email: req.body.email})});
            });
        }
        ).catch(err => {
            res.status(500).send({msg: err.message});
        });
    }

};