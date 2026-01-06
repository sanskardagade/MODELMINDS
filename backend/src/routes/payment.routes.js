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

const router = express.Router();

// All routes require HEAD role
router.use(authenticate);
router.use(authorize('HEAD'));

router.post('/', addPayment);
router.get('/summary', getPaymentSummary);
router.get('/:projectId', getProjectPayments);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);

module.exports = router;


