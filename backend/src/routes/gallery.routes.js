const express = require('express');
const { getPublicGallery } = require('../controllers/gallery.controller');

const router = express.Router();

// Public route - no authentication required
router.get('/public', getPublicGallery);

module.exports = router;

