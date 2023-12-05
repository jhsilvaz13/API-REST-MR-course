var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = async function(req, res){
    try{
        var bicis = await Bicicleta.allBicis();
        res.status(200).json({
            bicicletas: bicis
        });
    }catch(err){
        res.status(500).json({
            error: err
        });
    }
}

exports.bicicleta_find = async function(req, res){
    try{
        var bici = await Bicicleta.findByCode(req.params.code);
        res.status(200).json({
            bicicleta: bici
        });
    }catch(err){
        res.status(500).json({
            error: err
        });
    }
}

exports.bicicleta_create = async function(req, res){
    try{
        var bici = new Bicicleta({code: req.body.code, color: req.body.color, modelo: req.body.modelo});
        bici.ubicacion = [req.body.lat, req.body.lng];
        await Bicicleta.add(bici);
        res.status(200).json({
            bicicleta: bici
        });
    }catch(err){
        res.status(500).json({
            error: err
        });
    }
}

exports.bicicleta_delete = async function(req, res){
    try{
        console.log(req.params.code);
        await Bicicleta.removeByCode(req.params.code);
        res.status(200).send();
    }catch(err){
        res.status(500).json({
            error: err
        });
    }
}

exports.bicicleta_update = async function(req, res){
    try{
        var bici = await Bicicleta.findByCode(req.params.code);
        bici.code = req.body.code;
        bici.color = req.body.color;
        bici.modelo = req.body.modelo;
        bici.ubicacion = [req.body.lat, req.body.lng];
        await Bicicleta.updateByCode(req.params.code, bici);
        res.status(200).json({
            bicicleta: bici
        });
    }catch(err){
        res.status(500).json({
            error: err
        });
    }
}

