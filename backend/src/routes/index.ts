import { Router } from 'express';
import authRoutes from './auth';
import adminRoutes from './admin';
import courierRoutes from './couriers';
import disputeRoutes from './disputes';
import jobsRoutes from './jobs';
import ledgerRoutes from './ledger';
import offersRoutes from './offers';
import paymentsRoutes from './payments';
import usersRoutes from './users';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/jobs', jobsRoutes);
router.use('/jobs/:jobId/offers', offersRoutes);
router.use('/payments', paymentsRoutes);
router.use('/couriers', courierRoutes);
router.use('/ledger', ledgerRoutes);
router.use('/admin', adminRoutes);
router.use('/disputes', disputeRoutes);

export default router;
