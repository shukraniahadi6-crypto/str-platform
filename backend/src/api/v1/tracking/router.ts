import { Router } from 'express';
import { authenticate } from '../../../middleware/auth';

const router = Router();

router.use(authenticate);
// Tracking is primarily handled via Socket.io (/tracking namespace)
// This REST endpoint returns current courier location for a job
router.get('/jobs/:id/courier-location', async (req, res, next) => {
  try {
    const { AppDataSource } = require('../../../core/database');
    const { Job } = require('../../../models/Job');
    const { CourierLocation } = require('../../../models/Job');
    const job = await AppDataSource.getRepository(Job).findOne({ where: { id: req.params.id } });
    if (!job || !job.courier_id) {
      res.status(404).json({ code: 'NOT_FOUND', message: 'No courier assigned to this job' });
      return;
    }
    const location = await AppDataSource.getRepository(CourierLocation).findOne({
      where: { courier_id: job.courier_id },
    });
    res.json(location);
  } catch (err) { next(err); }
});

export default router;
