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

const router = express.Router();

// All routes require USER role
router.use(authenticate);
router.use(authorize('USER'));

router.get('/projects', getAssignedProjects);
router.get('/projects/:id', getProjectDetails);
router.get('/projects/:id/progress', getProjectProgress);
router.get('/projects/:id/images', getProjectImages);
router.get('/projects/:id/payments', getPaymentStatus);

module.exports = router;


