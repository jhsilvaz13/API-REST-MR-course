var express = require('express');
var router = express.Router();
var usuarioController = require('../controllers/usuario');

router.get('/login', usuarioController.login_get);
router.post('/login', usuarioController.login);
router.get('/logout', usuarioController.logout);
router.get('/forgotPassword', usuarioController.forgotPassword_get);
router.post('/forgotPassword', usuarioController.forgotPassword);
router.get('/resetPassword/:token', usuarioController.resetPassword_get);
router.post('/resetPassword', usuarioController.resetPassword);

module.exports = router;