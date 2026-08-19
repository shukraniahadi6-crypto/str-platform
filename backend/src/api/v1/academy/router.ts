import { Router } from 'express';
import { listCourses, complete, getBadges } from './controller';
import { authenticate, requireRole } from '../../../middleware/auth';
import { UserRole } from '../../../models/User';

const router = Router();

router.use(authenticate);
router.get('/courses', listCourses);
router.post('/courses/:id/complete', requireRole(UserRole.COURIER), complete);
router.get('/badges', requireRole(UserRole.COURIER), getBadges);

export default router;
