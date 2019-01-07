var express = require('express');
var router = express.Router();

var db = require('../queries');

router.post('/api/users', db.getAllUsers);
router.get('/api/user/:uid', db.getUser);
router.get('/api/card-users/:uid', db.getCardUsers);
router.get('/api/map-users/:uid', db.getMapUsers);
router.post('/api/user/:uid', db.createUser);
router.put('/api/user/:uid', db.updateUser);
router.delete('/api/user/:uid', db.removeUser);

router.post('/api/chat-conversations/', db.getAllConversations);
router.get('/api/chat-conversation/:uid', db.getConversation);
router.post('/api/chat-conversation/:uid', db.createConversation);
router.put('/api/chat-conversation/:uid', db.updateConversation);
router.delete('/api/chat-conversation/:uid', db.removeConversation);

module.exports = router;
