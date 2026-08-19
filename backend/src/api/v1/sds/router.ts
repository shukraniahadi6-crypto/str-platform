import { Router } from 'express';
import { getCases, reviewCase } from './controller';
import { authenticate, requireRole } from '../../../middleware/auth';
import { UserRole } from '../../../models/User';

const router = Router();

router.use(authenticate, requireRole(UserRole.ADMIN));
router.get('/cases', getCases);
router.post('/cases/:id/review', reviewCase);

export default router;
