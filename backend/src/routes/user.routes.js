const express = require('express');
const {
  getAssignedProjects,
  getProjectDetails,
  getProjectProgress,
  getProjectImages,
  getPaymentStatus,
} = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validateUUID } = require('../middlewares/validation.middleware');

const router = express.Router();

// All routes require USER role
router.use(authenticate);
router.use(authorize('USER'));

router.get('/projects', getAssignedProjects);
router.get('/projects/:id', validateUUID, getProjectDetails);
router.get('/projects/:id/progress', validateUUID, getProjectProgress);
router.get('/projects/:id/images', validateUUID, getProjectImages);
router.get('/projects/:id/payments', validateUUID, getPaymentStatus);

module.exports = router;

