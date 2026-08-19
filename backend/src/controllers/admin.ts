import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { getAdminAnalytics } from '../services/admin';

export const analyticsController = async (_req: AuthedRequest, res: Response): Promise<void> => {
  const analytics = await getAdminAnalytics();
  res.json(analytics);
};
