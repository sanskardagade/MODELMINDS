const express = require('express');
const { getAllEmployees, getAllClients, getAllEmployeeWorkLogs, assignProjectToEmployee, createEmployee, createClient } = require('../controllers/admin.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = express.Router();

// All routes require HEAD role
router.use(authenticate);
router.use(authorize('HEAD'));

router.get('/employees', getAllEmployees);
router.post('/employees', createEmployee);
router.get('/clients', getAllClients);
router.post('/clients', createClient);
router.get('/employee-feedback', getAllEmployeeWorkLogs);
router.post('/assign-project', assignProjectToEmployee);

module.exports = router;

