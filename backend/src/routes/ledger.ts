import { Router } from 'express';
import { listLedgerController } from '../controllers/ledger';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, listLedgerController);

export default router;
