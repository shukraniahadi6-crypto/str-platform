import { Router } from 'express';
import { getBalance, getHistory, verifyLedgerIntegrity, cashout, getPayoutHistory } from './controller';
import { authenticate, requireRole } from '../../../middleware/auth';
import { UserRole } from '../../../models/User';

const router = Router();

router.use(authenticate);
router.get('/balance', getBalance);
router.get('/history', getHistory);
router.get('/verify', requireRole(UserRole.ADMIN), verifyLedgerIntegrity);
router.post('/cashout', requireRole(UserRole.COURIER), cashout);
router.get('/payouts/history', requireRole(UserRole.COURIER), getPayoutHistory);

export default router;
