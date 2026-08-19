import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { createJob, getJobById, listJobs, updateJobStatus } from '../services/job';

export const createJobController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const job = await createJob({ ...req.body, customerId: req.user!.userId });
  res.status(201).json(job);
};

export const listJobsController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const jobs = await listJobs({
    status: req.query.status as 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled' | undefined,
    search: typeof req.query.search === 'string' ? req.query.search : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    offset: req.query.offset ? Number(req.query.offset) : undefined,
  });
  res.json(jobs);
};

export const getJobController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const job = await getJobById(String(req.params.jobId));
  res.json(job);
};

export const updateJobStatusController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const job = await updateJobStatus(
    String(req.params.jobId),
    req.body.status,
    req.user?.role === 'courier' ? req.user.userId : undefined,
  );
  res.json(job);
};
