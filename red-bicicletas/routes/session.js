var express = require('express');
var router = express.Router();
var usuarioController = require('../controllers/usuario');

router.get('/login', usuarioController.login_get);
router.post('/login', usuarioController.login);

module.exports = router;