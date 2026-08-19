import { detectObjects, detectLabels } from '../core/google-vision';
import { HazardCategory } from '../models/SDSCase';

export interface EstimateItem {
  name: string;
  quantity: number;
  category: string;
}

export interface EstimateResult {
  items: EstimateItem[];
  estimatedVolumeYd3: number;
  weightClass: 'LIGHT' | 'MEDIUM' | 'HEAVY';
  pricingTier: 'BASIC' | 'STANDARD' | 'PREMIUM';
  confidenceScore: number;
  hazardFlags: HazardCategory[];
  estimatedPrice: number;
}

const WASTE_CATEGORIES: Record<string, { volume: number; weight: string; hazard?: HazardCategory }> = {
  mattress: { volume: 1.5, weight: 'HEAVY' },
  sofa: { volume: 2.0, weight: 'HEAVY' },
  refrigerator: { volume: 1.0, weight: 'HEAVY', hazard: HazardCategory.CHEMICALS },
  television: { volume: 0.3, weight: 'MEDIUM', hazard: HazardCategory.ELECTRONICS },
  computer: { volume: 0.2, weight: 'LIGHT', hazard: HazardCategory.ELECTRONICS },
  battery: { volume: 0.1, weight: 'LIGHT', hazard: HazardCategory.HAZMAT },
  pallet: { volume: 0.5, weight: 'MEDIUM' },
  bag: { volume: 0.1, weight: 'LIGHT' },
  box: { volume: 0.2, weight: 'LIGHT' },
  furniture: { volume: 1.5, weight: 'HEAVY' },
  appliance: { volume: 0.8, weight: 'HEAVY', hazard: HazardCategory.CHEMICALS },
  tire: { volume: 0.3, weight: 'MEDIUM', hazard: HazardCategory.CHEMICALS },
};

const PRICING_TABLE = {
  BASIC: 50,
  STANDARD: 100,
  PREMIUM: 180,
};

export async function estimateFromImage(imageBase64: string): Promise<EstimateResult> {
  const [objects, labels] = await Promise.all([
    detectObjects(imageBase64),
    detectLabels(imageBase64),
  ]);

  const detectedNames = [
    ...objects.map((o) => o.name.toLowerCase()),
    ...labels.map((l) => l.description.toLowerCase()),
  ];

  const itemMap = new Map<string, { count: number; score: number }>();
  const hazardFlags = new Set<HazardCategory>();

  for (const name of detectedNames) {
    for (const [key, data] of Object.entries(WASTE_CATEGORIES)) {
      if (name.includes(key)) {
        const existing = itemMap.get(key) || { count: 0, score: 0 };
        itemMap.set(key, { count: existing.count + 1, score: Math.max(existing.score, 0.8) });
        if (data.hazard) hazardFlags.add(data.hazard);
      }
    }
  }

  const items: EstimateItem[] = Array.from(itemMap.entries()).map(([name, { count }]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    quantity: count,
    category: WASTE_CATEGORIES[name]?.weight || 'GENERAL',
  }));

  let totalVolume = 0;
  for (const [name, { count }] of itemMap.entries()) {
    totalVolume += (WASTE_CATEGORIES[name]?.volume || 0.2) * count;
  }

  const weightClass: 'LIGHT' | 'MEDIUM' | 'HEAVY' =
    totalVolume > 3 ? 'HEAVY' : totalVolume > 1 ? 'MEDIUM' : 'LIGHT';

  const pricingTier: 'BASIC' | 'STANDARD' | 'PREMIUM' =
    weightClass === 'HEAVY' ? 'PREMIUM' : weightClass === 'MEDIUM' ? 'STANDARD' : 'BASIC';

  const avgConfidence =
    objects.length > 0
      ? objects.reduce((sum, o) => sum + o.score, 0) / objects.length
      : 0.5;

  return {
    items: items.length > 0 ? items : [{ name: 'General Waste', quantity: 1, category: 'GENERAL' }],
    estimatedVolumeYd3: Math.max(totalVolume, 0.1),
    weightClass,
    pricingTier,
    confidenceScore: avgConfidence,
    hazardFlags: Array.from(hazardFlags),
    estimatedPrice: PRICING_TABLE[pricingTier],
  };
}
