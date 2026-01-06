const express = require('express');
const { login, logout, getCurrentUser } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateLogin } = require('../middlewares/validation.middleware');

const router = express.Router();

// Public routes
router.post('/login', validateLogin, login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

module.exports = router;

