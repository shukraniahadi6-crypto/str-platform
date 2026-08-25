import { Router } from 'express';
import { analyticsController } from '../controllers/admin';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/analytics', requireAuth, requireRole('admin'), analyticsController);

export default router;
