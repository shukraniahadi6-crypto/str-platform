import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { acceptBid, listBidsByJob, placeBid } from '../services/offer';

export const placeBidController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const bid = await placeBid(String(req.params.jobId), req.user!.userId, Number(req.body.price));
  res.status(201).json(bid);
};

export const listBidsController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const bids = await listBidsByJob(String(req.params.jobId));
  res.json(bids);
};

export const acceptBidController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const job = await acceptBid(String(req.params.jobId), String(req.params.bidId));
  res.json(job);
};
