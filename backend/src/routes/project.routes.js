const express = require('express');
const {
  createProject,
  getAllProjects,
  getProjectById,
  assignProjectToUser,
  updateProgress,
  updateAmounts,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validateProject, validateUUID } = require('../middlewares/validation.middleware');

const router = express.Router();

// All routes require HEAD role
router.use(authenticate);
router.use(authorize('HEAD'));

router.post('/', validateProject, createProject);
router.get('/', getAllProjects);
router.get('/:id', validateUUID, getProjectById);
router.put('/:id', validateUUID, validateProject, updateProject);
router.put('/:id/assign-user', validateUUID, assignProjectToUser);
router.put('/:id/progress', validateUUID, updateProgress);
router.put('/:id/amounts', validateUUID, updateAmounts);
router.delete('/:id', validateUUID, deleteProject);

module.exports = router;

