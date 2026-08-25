import { Router } from 'express';
import { body } from 'express-validator';
import {
  chargeController,
  createStripeCustomerController,
  listPaymentsController,
  refundController,
} from '../controllers/payments';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

router.post('/customers', requireAuth, body('email').isEmail(), validateRequest, createStripeCustomerController);
router.post(
  '/charge',
  requireAuth,
  requireRole('admin', 'customer'),
  [body('jobId').isUUID(), body('customerId').isUUID(), body('courierId').isUUID(), body('amount').isFloat({ gt: 0 })],
  validateRequest,
  chargeController,
);
router.post('/:paymentId/refund', requireAuth, requireRole('admin'), refundController);
router.get('/', requireAuth, requireRole('admin'), listPaymentsController);

export default router;
