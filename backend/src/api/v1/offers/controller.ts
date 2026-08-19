import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../../core/database';
import { OfferPing, OfferPingStatus } from '../../../models/OfferPing';
import { acceptOffer, declineOffer } from '../../../services/dispatch';
import { UserRole } from '../../../models/User';

const offerRepo = () => AppDataSource.getRepository(OfferPing);

export async function getActiveOffers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const offers = await offerRepo().find({
      where: { courier_id: req.user!.id, status: OfferPingStatus.PENDING },
      relations: ['job'],
    });
    res.json(offers);
  } catch (err) { next(err); }
}

export async function accept(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ping = await acceptOffer(req.params.id, req.user!.id);
    res.json(ping);
  } catch (err) { next(err); }
}

export async function decline(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await declineOffer(req.params.id, req.user!.id);
    res.json({ message: 'Offer declined' });
  } catch (err) { next(err); }
}
