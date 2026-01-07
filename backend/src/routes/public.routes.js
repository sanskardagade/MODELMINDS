const express = require('express');
const { getPublicProject, getPublicProjects } = require('../controllers/public.controller');
const { validateUUID } = require('../middlewares/validation.middleware');

const router = express.Router();

// Public routes - no authentication required
router.get('/projects', getPublicProjects);
router.get('/projects/:id', validateUUID, getPublicProject);

module.exports = router;


