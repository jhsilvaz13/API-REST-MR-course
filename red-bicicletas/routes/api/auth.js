var express = require('express');
var router = express.Router();
var authControllerAPI = require('../../controllers/api/authControllerAPI');

router.post('/login', authControllerAPI.authenticate);
router.post('/signup', authControllerAPI.signup);
router.post('/logout', authControllerAPI.logout);


module.exports = router;