const express = require('express');
const {
  getAssignedProjects,
  addWorkLog,
  updateWorkLog,
  getProjectWorkLogs,
  getMyWorkLogs,
} = require('../controllers/employee.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validateWorkLog, validateUUID } = require('../middlewares/validation.middleware');

const router = express.Router();

// All routes require EMPLOYEE role
router.use(authenticate);
router.use(authorize('EMPLOYEE'));

router.get('/projects', getAssignedProjects);
router.get('/work-logs', getMyWorkLogs);
router.get('/work-logs/:projectId', validateUUID, getProjectWorkLogs);
router.post('/work-logs', validateWorkLog, addWorkLog);
router.put('/work-logs/:id', validateUUID, validateWorkLog, updateWorkLog);

module.exports = router;

