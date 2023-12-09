var Usuario = require('../../models/usuario');
var Bicicleta = require('../../models/bicicleta');

exports.usuarios_list = async function (req, res) {
    try{
        var usuarios = await Usuario.allUsuarios();
        res.status(200).json({
            usuarios: usuarios
        });
    }catch(err){
        res.status(500).json({
            error: err
        });
    }
}

exports.usuario_create = async function (req, res) {
    try{
        var usuario = new Usuario({code: req.body.code, nombre: req.body.nombre});
        await Usuario.add(usuario);
        res.status(200).json({
            usuario: usuario
        });
    }catch(err){
        res.status(500).json({
            error: err,
        });
    }
}

exports.usuario_reservar = async function (req, res) {
    try{
        var usuario= await Usuario.findByCode(req.body.code_usuario);
        var bicicleta= await Bicicleta.findByCode(req.body.code_bici);
        console.log(usuario);
        console.log(bicicleta);
        usuario.reservar(bicicleta.id, req.body.desde, req.body.hasta);
        res.status(200).send();
    }catch(err){
        res.status(500).json({
            message: err.message
        });
    }
}

exports.usuario_forgotPassword = async function (req, res) {
    try{
        var usuario= await Usuario.findOne({email: req.body.email});
        if (usuario){
            usuario.forgotPassword(usuario.email);
            res.status(200).json({
                message: 'Se envio un email para reestablecer el password'
            });
        }else{
            res.status(404).json({
                message: 'No existe el usuario'
            });
        }
    }catch(err){
        res.status(500).json({
            message: err.message
        });
    }
}
