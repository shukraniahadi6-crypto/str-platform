import { Router } from 'express';
import { body } from 'express-validator';
import { acceptBidController, listBidsController, placeBidController } from '../controllers/offers';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router({ mergeParams: true });

router.post('/', requireAuth, requireRole('courier'), body('price').isFloat({ gt: 0 }), validateRequest, placeBidController);
router.get('/', requireAuth, listBidsController);
router.post('/:bidId/accept', requireAuth, requireRole('customer', 'admin'), acceptBidController);

export default router;
