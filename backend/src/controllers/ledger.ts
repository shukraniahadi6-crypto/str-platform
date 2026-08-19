import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { getLedgerForUser } from '../services/ledger';

export const listLedgerController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const rows = await getLedgerForUser(req.user!.userId);
  res.json(rows);
};
