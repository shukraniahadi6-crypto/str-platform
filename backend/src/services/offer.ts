import { Offer } from '../models/Offer';
import { Job } from '../models/Job';
import { AppError } from '../utils/errors';

export const placeBid = async (jobId: string, courierId: string, price: number): Promise<Offer> => {
  const job = await Job.findByPk(jobId);
  if (!job) throw new AppError(404, 'Job not found');
  if (job.status !== 'pending') throw new AppError(409, 'Job is no longer accepting bids');
  return Offer.create({ jobId, courierId, price });
};

export const listBidsByJob = async (jobId: string): Promise<Offer[]> => {
  return Offer.findAll({ where: { jobId }, order: [['price', 'ASC']] });
};

export const acceptBid = async (jobId: string, bidId: string): Promise<Job> => {
  const job = await Job.findByPk(jobId);
  if (!job) throw new AppError(404, 'Job not found');

  const bid = await Offer.findOne({ where: { id: bidId, jobId } });
  if (!bid) throw new AppError(404, 'Bid not found');

  await Offer.update({ status: 'rejected' }, { where: { jobId } });
  bid.status = 'accepted';
  await bid.save();

  job.status = 'accepted';
  job.courierId = bid.courierId;
  job.acceptedBidId = bid.id;
  await job.save();
  return job;
};
