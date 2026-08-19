import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../../core/database';
import { GreenImpactMetric, UpcyclableItem } from '../../../models/GreenImpact';
import { DonationPartner } from '../../../models/Job';
import { calculateGreenImpact, generateGreenReceipt } from '../../../services/green-impact';
import { NotFoundError } from '../../../utils/errors';
import { haversineDistance } from '../../../utils/spatial';

export async function getGreenImpact(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const metric = await AppDataSource.getRepository(GreenImpactMetric)
      .findOne({ where: { job_id: req.params.id } });
    if (!metric) throw new NotFoundError('GreenImpactMetric');
    res.json(metric);
  } catch (err) { next(err); }
}

export async function generateReceipt(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const receipt = await generateGreenReceipt(req.params.id, req.user!.id);
    res.json(receipt);
  } catch (err) { next(err); }
}

export async function upcycleRedirect(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { lat, lng } = req.body;
    const itemRepo = AppDataSource.getRepository(UpcyclableItem);
    const partnerRepo = AppDataSource.getRepository(DonationPartner);

    const item = await itemRepo.findOne({ where: { id: req.params.item_id, job_id: req.params.id } });
    if (!item) throw new NotFoundError('UpcyclableItem');

    // Find nearest donation partner
    const partners = await partnerRepo.find({ where: { is_active: true } });
    let nearest: DonationPartner | null = null;
    let minDist = Infinity;
    for (const p of partners) {
      const dist = haversineDistance(lat, lng, Number(p.latitude), Number(p.longitude));
      if (dist < minDist) { minDist = dist; nearest = p; }
    }

    if (nearest) {
      item.donation_partner_id = nearest.id;
      await itemRepo.save(item);
    }

    res.json({ item, nearestPartner: nearest });
  } catch (err) { next(err); }
}
