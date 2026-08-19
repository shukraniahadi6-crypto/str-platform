import { AppDataSource } from '../core/database';
import { GreenImpactMetric, GreenImpactReceipt, UpcyclableItem } from '../models/GreenImpact';
import { Job } from '../models/Job';
import { NotFoundError } from '../utils/errors';

// EPA equivalency factors
const CO2_PER_KG_LANDFILL = 0.58; // kg CO2 per kg of waste to landfill avoided
const TREES_PER_KG_CO2 = 0.02; // trees equivalent per kg CO2
const WATER_SAVED_PER_KG = 1.5; // liters

interface ItemDisposal {
  name: string;
  quantity: number;
  weightKg: number;
  method: 'LANDFILL' | 'RECYCLE' | 'UPCYCLE' | 'DONATE';
}

export async function calculateGreenImpact(
  jobId: string,
  items: ItemDisposal[]
): Promise<GreenImpactMetric> {
  const jobRepo = AppDataSource.getRepository(Job);
  const metricRepo = AppDataSource.getRepository(GreenImpactMetric);

  const job = await jobRepo.findOne({ where: { id: jobId } });
  if (!job) throw new NotFoundError('Job');

  let totalWeight = 0;
  let divertedWeight = 0;

  for (const item of items) {
    const weight = item.weightKg * item.quantity;
    totalWeight += weight;
    if (item.method !== 'LANDFILL') divertedWeight += weight;
  }

  const landfillDiversionPct = totalWeight > 0 ? (divertedWeight / totalWeight) * 100 : 0;
  const co2SavedKg = divertedWeight * CO2_PER_KG_LANDFILL;
  const treesEquivalent = co2SavedKg * TREES_PER_KG_CO2;
  const waterSavedLiters = divertedWeight * WATER_SAVED_PER_KG;

  const existing = await metricRepo.findOne({ where: { job_id: jobId } });
  if (existing) {
    existing.landfill_diversion_pct = landfillDiversionPct;
    existing.co2_saved_kg = co2SavedKg;
    existing.trees_equivalent = treesEquivalent;
    existing.water_saved_liters = waterSavedLiters;
    return metricRepo.save(existing);
  }

  return metricRepo.save(metricRepo.create({
    job_id: jobId,
    landfill_diversion_pct: landfillDiversionPct,
    co2_saved_kg: co2SavedKg,
    trees_equivalent: treesEquivalent,
    water_saved_liters: waterSavedLiters,
  }));
}

export async function generateGreenReceipt(jobId: string, vendorId: string): Promise<GreenImpactReceipt> {
  const metricRepo = AppDataSource.getRepository(GreenImpactMetric);
  const receiptRepo = AppDataSource.getRepository(GreenImpactReceipt);

  const metric = await metricRepo.findOne({ where: { job_id: jobId } });
  if (!metric) throw new NotFoundError('GreenImpactMetric');

  const impactCardJson = {
    jobId,
    landfillDiversionPct: metric.landfill_diversion_pct,
    co2SavedKg: metric.co2_saved_kg,
    treesEquivalent: metric.trees_equivalent,
    waterSavedLiters: metric.water_saved_liters,
    message: `You helped divert ${metric.landfill_diversion_pct.toFixed(0)}% of waste from landfill!`,
    generatedAt: new Date().toISOString(),
  };

  const socialShareUrl = `https://strplatform.com/impact/${jobId}`;

  return receiptRepo.save(receiptRepo.create({
    job_id: jobId,
    vendor_id: vendorId,
    impact_card_json: impactCardJson,
    social_share_url: socialShareUrl,
  }));
}
