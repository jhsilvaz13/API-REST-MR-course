var Usuario = require('../models/usuario');
var Token = require('../models/token');

module.exports = {
    confirmationGet: function (req, res, next) {
        
        Token.findOne({token:req.params.token})
        .then(token => {
            if (!token) return res.status(400).send({ type: 'not-verified', msg: 'No encontramos un usuario con este token. Quizas haya expirado.' });

            Usuario.findById(token._userId)
            .then(usuario => {
                if (!usuario) return res.status(400).send({ msg: 'No encontramos un usuario con este token.' });
                if (usuario.verificado) return res.redirect('/usuarios');

                usuario.verificado = true;
                usuario.save()
                .then(() => res.redirect('/'))
                .catch(err => res.status(500).send({ msg: err.message }));
            })
            .catch(err => res.status(500).send({ msg: err.message }));
        }
        )
        .catch(err => res.status(500).send({ msg: err.message }));

    },
    resetPassword: function (req, res, next) {
        Token.findOne({token:req.params.token})
        .then(token => {
            if (!token) return res.status(400).send({ type: 'not-verified', msg: 'No encontramos un usuario con este token. Quizas haya expirado.' });
            Usuario.findById(token._userId)
            .then(usuario => {
                if (!usuario) return res.status(400).send({ msg: 'No encontramos un usuario con este token.' });
                usuario.password = req.body.password;
                usuario.save()
                .then(() => res.redirect('/'))
            })
            .catch(err => res.status(500).send({ msg: err.message }));
        }
        )
        .catch(err => res.status(500).send({ msg: err.message }));
    }
};
        