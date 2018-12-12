var express = require('express');
var router = express.Router();

var db = require('../queries');

router.post('/api/users', db.getAllUsers);
router.get('/api/user/:uid', db.getUser);
router.post('/api/user/:uid', db.createUser);
router.put('/api/user/:uid', db.updateUser);
router.delete('/api/user/:uid', db.removeUser);

module.exports = router;
