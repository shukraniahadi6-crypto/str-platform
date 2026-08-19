import { Router } from 'express';
import { getActiveOffers, accept, decline } from './controller';
import { authenticate, requireRole } from '../../../middleware/auth';
import { UserRole } from '../../../models/User';
import { offerPingRateLimit } from '../../../middleware/rateLimit';

const router = Router();

router.use(authenticate);
router.get('/active', requireRole(UserRole.COURIER), getActiveOffers);
router.post('/:id/accept', requireRole(UserRole.COURIER), offerPingRateLimit, accept);
router.post('/:id/decline', requireRole(UserRole.COURIER), decline);

export default router;
