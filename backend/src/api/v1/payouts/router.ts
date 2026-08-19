import { Router } from 'express';
import { cashout, getPayoutHistory } from '../ledger/controller';
import { authenticate, requireRole } from '../../../middleware/auth';
import { UserRole } from '../../../models/User';

const router = Router();

router.use(authenticate, requireRole(UserRole.COURIER));
router.post('/request-cashout', cashout);
router.get('/history', getPayoutHistory);

export default router;
