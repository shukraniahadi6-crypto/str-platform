import { Router } from 'express';
import { deactivateUserController, getMeController, listUsersController, updateMeController } from '../controllers/users';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/me', requireAuth, getMeController);
router.patch('/me', requireAuth, updateMeController);
router.get('/', requireAuth, requireRole('admin'), listUsersController);
router.delete('/:userId', requireAuth, requireRole('admin'), deactivateUserController);

export default router;
