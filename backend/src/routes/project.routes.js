const express = require('express');
const {
  createProject,
  getAllProjects,
  getProjectById,
  assignProjectToUser,
  updateProgress,
  updateAmounts,
  deleteProject,
} = require('../controllers/project.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = express.Router();

// All routes require HEAD role
router.use(authenticate);
router.use(authorize('HEAD'));

router.post('/', createProject);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id/assign-user', assignProjectToUser);
router.put('/:id/progress', updateProgress);
router.put('/:id/amounts', updateAmounts);
router.delete('/:id', deleteProject);

module.exports = router;


