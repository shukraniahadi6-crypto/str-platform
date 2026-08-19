import { Op } from 'sequelize';
import { Job, JobStatus } from '../models/Job';
import { AppError } from '../utils/errors';

export const createJob = async (input: {
  customerId: string;
  title: string;
  description: string;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledAt?: string;
}): Promise<Job> => {
  return Job.create({
    customerId: input.customerId,
    title: input.title,
    description: input.description,
    pickupAddress: input.pickupAddress,
    dropoffAddress: input.dropoffAddress,
    scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
  });
};

export const listJobs = async (query: { status?: JobStatus; search?: string; limit?: number; offset?: number }): Promise<Job[]> => {
  return Job.findAll({
    where: {
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            [Op.or]: [
              { title: { [Op.iLike]: `%${query.search}%` } },
              { description: { [Op.iLike]: `%${query.search}%` } },
            ],
          }
        : {}),
    },
    order: [['createdAt', 'DESC']],
    limit: query.limit ?? 20,
    offset: query.offset ?? 0,
  });
};

export const getJobById = async (id: string): Promise<Job> => {
  const job = await Job.findByPk(id);
  if (!job) throw new AppError(404, 'Job not found');
  return job;
};

export const updateJobStatus = async (id: string, status: JobStatus, courierId?: string): Promise<Job> => {
  const job = await getJobById(id);
  job.status = status;
  if (courierId) job.courierId = courierId;
  await job.save();
  return job;
};
