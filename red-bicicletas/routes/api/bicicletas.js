var express = require('express');
var router = express.Router();
var bicicletaController = require('../../controllers/api/bicicletaControllerAPI');

router.get('/', bicicletaController.bicicleta_list);
router.post('/create', bicicletaController.bicicleta_create);
router.delete('/:code/delete', bicicletaController.bicicleta_delete);
router.put('/:code/update', bicicletaController.bicicleta_update);
router.get('/:code', bicicletaController.bicicleta_find);

module.exports = router;