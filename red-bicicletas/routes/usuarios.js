var express = require('express');
var router = express.Router();
var usuarioController = require('../controllers/usuario');

router.get('/', usuarioController.list);
router.get('/create', usuarioController.create_get);
router.post('/create', usuarioController.create);
router.get('/:id/update', usuarioController.update_get);
router.post('/:id/update', usuarioController.update);
router.post('/:id/delete', usuarioController.delete);
router.post('/forgotPassword', usuarioController.forgotPassword);


module.exports = router;