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
