import { Router } from 'express';
import { body } from 'express-validator';
import { createJobController, getJobController, listJobsController, updateJobStatusController } from '../controllers/jobs';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createJobValidator } from '../utils/validators';

const router = Router();

router.post('/', requireAuth, createJobValidator, validateRequest, createJobController);
router.get('/', requireAuth, listJobsController);
router.get('/:jobId', requireAuth, getJobController);
router.patch(
  '/:jobId/status',
  requireAuth,
  [body('status').isIn(['pending', 'accepted', 'in-progress', 'completed', 'cancelled'])],
  validateRequest,
  updateJobStatusController,
);

export default router;
