import { Router } from 'express';
import { onboardCourierController, updateAvailabilityController } from '../controllers/couriers';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.post('/onboard', requireAuth, requireRole('courier'), onboardCourierController);
router.patch('/availability', requireAuth, requireRole('courier'), updateAvailabilityController);

export default router;
