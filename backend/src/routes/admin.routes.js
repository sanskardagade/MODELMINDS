const express = require('express');
const { getAllEmployees, getAllClients, getAllEmployeeWorkLogs, assignProjectToEmployee } = require('../controllers/admin.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = express.Router();

// All routes require HEAD role
router.use(authenticate);
router.use(authorize('HEAD'));

router.get('/employees', getAllEmployees);
router.get('/clients', getAllClients);
router.get('/employee-feedback', getAllEmployeeWorkLogs);
router.post('/assign-project', assignProjectToEmployee);

module.exports = router;

