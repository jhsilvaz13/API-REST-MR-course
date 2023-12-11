var express = require('express');
var router = express.Router();
var usuarioController = require('../../controllers/api/usuarioControllerAPI');

router.get('/', usuarioController.usuarios_list);
router.post('/reservar', usuarioController.usuario_reservar);
router.post('/forgotPassword', usuarioController.usuario_forgotPassword);


module.exports = router;