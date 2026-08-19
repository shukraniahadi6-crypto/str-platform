import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { createDispute, listDisputes, resolveDispute } from '../services/dispute';

export const createDisputeController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const dispute = await createDispute({ ...req.body, openedByUserId: req.user!.userId });
  res.status(201).json(dispute);
};

export const listDisputesController = async (_req: AuthedRequest, res: Response): Promise<void> => {
  const disputes = await listDisputes();
  res.json(disputes);
};

export const resolveDisputeController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const disputeId = String(req.params.disputeId);
  const status = req.body.status as 'resolved' | 'rejected';
  const dispute = await resolveDispute(disputeId, status, String(req.body.resolutionNotes ?? ''));
  if (!dispute) {
    res.status(404).json({ error: { message: 'Dispute not found' } });
    return;
  }
  res.json(dispute);
};
