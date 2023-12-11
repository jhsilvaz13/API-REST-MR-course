const Usuario = require("../../models/usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");

exports.authenticate = async function (req, res, next) {
    try{
        var user=await Usuario.findOne({email: req.body.email})
        if(!user){
            return res.status(401).send({message: 'No existe el usuario'});
        }
        if(!user.validPassword(req.body.password)){
            return res.status(401).send({message: 'Password incorrecto'});
        }
        const token = jwt.sign({id: user._id}, config.secretKey, {expiresIn: '60m'});
        res.status(200).json({message: 'Usuario encontrado', data: {usuario: user, token: token}});

    }catch(err){
        res.status(500).json({
            message: err.message
        });
    }
};

exports.signup = async function (req, res) {
    try{
        var usuario = new Usuario({code: req.body.code, nombre: req.body.nombre, email: req.body.email, password: req.body.password, verificado: false});
        await Usuario.add(usuario);
        const token=jwt.sign({id: usuario._id}, config.secretKey, {expiresIn: '60m'});
        usuario.enviar_email_bienvenida(token);
        res.status(200).json({
            message: 'Usuario creado',
            usuario: usuario,
            token: token
        });
    }catch(err){
        res.status(500).json({
            error: err,
            message: err.message
        });
    }
}

exports.logout = function (req, res) {
    req.logout(
        function (err) {
            if (err) {
                res.status(500).json({ status: "error" });
            }
            res.status(200).json({ status: "logout" });
        }
    );
}
