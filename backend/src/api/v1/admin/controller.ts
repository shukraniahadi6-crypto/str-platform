import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../../core/database';
import { CourierLocation } from '../../../models/Job';
import { Job } from '../../../models/Job';
import { Dispute } from '../../../models/Dispute';
import { NotFoundError } from '../../../utils/errors';

export async function getLiveMap(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const locations = await AppDataSource.getRepository(CourierLocation).find();
    res.json(locations);
  } catch (err) { next(err); }
}

export async function getDailyAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [jobs, revenue] = await Promise.all([
      AppDataSource.getRepository(Job).count({
        where: { status: 'COMPLETED' as any },
      }),
      AppDataSource.getRepository(Job).count(),
    ]);

    res.json({ date: today, totalJobs: jobs, totalJobsAllStatuses: revenue });
  } catch (err) { next(err); }
}

export async function resolveDispute(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dispute = await AppDataSource.getRepository(Dispute).findOne({ where: { id: req.params.id } });
    if (!dispute) throw new NotFoundError('Dispute');
    const { decision, notes } = req.body;
    dispute.admin_decision = decision;
    dispute.resolution_notes = notes;
    dispute.status = 'RESOLVED';
    dispute.resolved_at = new Date();
    await AppDataSource.getRepository(Dispute).save(dispute);
    res.json(dispute);
  } catch (err) { next(err); }
}
