import { Router } from 'express';
import { createDisputeController, listDisputesController, resolveDisputeController } from '../controllers/disputes';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, createDisputeController);
router.get('/', requireAuth, requireRole('admin'), listDisputesController);
router.post('/:disputeId/resolve', requireAuth, requireRole('admin'), resolveDisputeController);

export default router;
