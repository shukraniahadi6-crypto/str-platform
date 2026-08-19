import { Router } from 'express';
import { getNearbyDeals, joinBatch } from './controller';
import { authenticate } from '../../../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/nearby-deals', getNearbyDeals);
router.post('/:id/join', joinBatch);

export default router;
