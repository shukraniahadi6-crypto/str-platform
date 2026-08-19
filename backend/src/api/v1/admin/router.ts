import { Router } from 'express';
import { getLiveMap, getDailyAnalytics, resolveDispute } from './controller';
import { authenticate, requireRole } from '../../../middleware/auth';
import { UserRole } from '../../../models/User';

const router = Router();

router.use(authenticate, requireRole(UserRole.ADMIN));
router.get('/fleet/live-map', getLiveMap);
router.get('/analytics/daily', getDailyAnalytics);
router.post('/disputes/:id/resolve', resolveDispute);

export default router;
