import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../../core/database';
import { Batch, NeighborhoodGroup } from '../../../models/Batch';
import { optimizeBatchRoute } from '../../../services/batching';
import { NotFoundError } from '../../../utils/errors';

const batchRepo = () => AppDataSource.getRepository(Batch);
const neighborhoodRepo = () => AppDataSource.getRepository(NeighborhoodGroup);

export async function getNearbyDeals(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const groups = await neighborhoodRepo().find();
    res.json(groups);
  } catch (err) { next(err); }
}

export async function joinBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const batch = await batchRepo().findOne({ where: { id: req.params.id } });
    if (!batch) throw new NotFoundError('Batch');
    const optimized = await optimizeBatchRoute(batch.id);
    res.json(optimized);
  } catch (err) { next(err); }
}
