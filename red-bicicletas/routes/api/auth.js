var express = require('express');
var router = express.Router();
var authControllerAPI = require('../../controllers/api/authControllerAPI');

router.post('/authenticate', authControllerAPI.authenticate);

module.exports = router;