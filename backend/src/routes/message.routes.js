const express = require('express');
const {
  sendMessage,
  getMessages,
  getConversations,
  getAdminUser,
} = require('../controllers/message.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validateUUID } = require('../middlewares/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes accessible by both USER and HEAD
router.post('/send', sendMessage);
router.get('/conversations', getConversations);
router.get('/messages', getMessages);
router.get('/admin', getAdminUser);

module.exports = router;

