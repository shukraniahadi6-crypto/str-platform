import { Router } from 'express';
import { getGreenImpact, generateReceipt, upcycleRedirect } from './controller';
import { authenticate } from '../../../middleware/auth';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.get('/jobs/:id/green-impact', getGreenImpact);
router.post('/jobs/:id/green-receipt', generateReceipt);
router.post('/jobs/:id/items/:item_id/upcycle-redirect', upcycleRedirect);

export default router;
