import { Request, Response, NextFunction } from 'express';
import {
  getVendorBalance, getCourierBalance, getLedgerHistory,
  verifyLedger, requestCashout
} from '../../../services/ledger';
import { UserRole } from '../../../models/User';
import { AppDataSource } from '../../../core/database';
import { Payout } from '../../../models/Ledger';

export async function getBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user!.role === UserRole.VENDOR) {
      const account = await getVendorBalance(req.user!.id);
      res.json(account);
    } else {
      const account = await getCourierBalance(req.user!.id);
      res.json(account);
    }
  } catch (err) { next(err); }
}

export async function getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string || '20', 10);
    const offset = parseInt(req.query.offset as string || '0', 10);
    const result = await getLedgerHistory(req.user!.id, limit, offset);
    res.json(result);
  } catch (err) { next(err); }
}

export async function verifyLedgerIntegrity(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await verifyLedger();
    res.json(result);
  } catch (err) { next(err); }
}

export async function cashout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { amount } = req.body;
    const payout = await requestCashout(req.user!.id, amount);
    res.status(201).json(payout);
  } catch (err) { next(err); }
}

export async function getPayoutHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const payouts = await AppDataSource.getRepository(Payout).find({
      where: { courier_id: req.user!.id },
      order: { requested_at: 'DESC' },
    });
    res.json(payouts);
  } catch (err) { next(err); }
}
