const express = require('express');
const {
  addPayment,
  getProjectPayments,
  getPaymentSummary,
  updatePayment,
  deletePayment,
} = require('../controllers/payment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validatePayment, validateUUID } = require('../middlewares/validation.middleware');

const router = express.Router();

// All routes require HEAD role
router.use(authenticate);
router.use(authorize('HEAD'));

router.post('/', validatePayment, addPayment);
router.get('/summary', getPaymentSummary);
router.get('/:projectId', validateUUID, getProjectPayments);
router.put('/:id', validateUUID, validatePayment, updatePayment);
router.delete('/:id', validateUUID, deletePayment);

module.exports = router;

