// Batching algorithm: groups nearby jobs, calculates discount.
interface Job {
  id: string;
  lat: number;
  lng: number;
  pricePence: number;
}

// Haversine formula — returns distance in km.
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function canBatch(job1: Job, job2: Job, maxDistanceKm = 1.0): boolean {
  return haversineKm(job1.lat, job1.lng, job2.lat, job2.lng) <= maxDistanceKm;
}

export function applyBatchDiscount(jobs: Job[], discountPct = 10): Job[] {
  return jobs.map((j) => ({
    ...j,
    pricePence: Math.round(j.pricePence * (1 - discountPct / 100)),
  }));
}

describe('Batching Algorithm — Unit Tests', () => {
  describe('haversineKm', () => {
    it('should return 0 for identical coordinates', () => {
      expect(haversineKm(51.5, -0.1, 51.5, -0.1)).toBeCloseTo(0, 5);
    });

    it('should calculate known distance (London → Paris ≈ 344 km)', () => {
      const dist = haversineKm(51.5074, -0.1278, 48.8566, 2.3522);
      expect(dist).toBeCloseTo(344, 0);
    });
  });

  describe('canBatch', () => {
    const jobA: Job = { id: 'j1', lat: 51.5, lng: -0.1, pricePence: 1000 };
    const jobB: Job = { id: 'j2', lat: 51.505, lng: -0.102, pricePence: 1200 };
    const jobFar: Job = { id: 'j3', lat: 52.0, lng: -0.5, pricePence: 900 };

    it('should return true for nearby jobs', () => {
      expect(canBatch(jobA, jobB)).toBe(true);
    });

    it('should return false for distant jobs', () => {
      expect(canBatch(jobA, jobFar)).toBe(false);
    });
  });

  describe('applyBatchDiscount', () => {
    const jobs: Job[] = [
      { id: 'j1', lat: 0, lng: 0, pricePence: 1000 },
      { id: 'j2', lat: 0, lng: 0, pricePence: 2000 },
    ];

    it('should apply 10% discount by default', () => {
      const discounted = applyBatchDiscount(jobs);
      expect(discounted[0].pricePence).toBe(900);
      expect(discounted[1].pricePence).toBe(1800);
    });

    it('should support custom discount percentage', () => {
      const discounted = applyBatchDiscount(jobs, 20);
      expect(discounted[0].pricePence).toBe(800);
    });

    it('should not mutate original jobs array', () => {
      applyBatchDiscount(jobs, 15);
      expect(jobs[0].pricePence).toBe(1000);
    });
  });
});
