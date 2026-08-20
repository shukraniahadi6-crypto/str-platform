// Dispatch engine: ranks and cascades offer pings to couriers.
interface Courier {
  id: string;
  distanceKm: number;
  rating: number;
  acceptanceRate: number;
  isOnline: boolean;
}

interface DispatchResult {
  courierId: string;
  score: number;
}

export function rankCouriers(couriers: Courier[]): DispatchResult[] {
  return couriers
    .filter((c) => c.isOnline)
    .map((c) => ({
      courierId: c.id,
      score: c.rating * 0.5 + c.acceptanceRate * 0.3 - c.distanceKm * 0.2,
    }))
    .sort((a, b) => b.score - a.score);
}

export function cascadeOffers(
  rankedCouriers: DispatchResult[],
  maxCascadeDepth: number
): string[] {
  return rankedCouriers.slice(0, maxCascadeDepth).map((r) => r.courierId);
}

describe('Dispatch Engine — Unit Tests', () => {
  const couriers: Courier[] = [
    { id: 'c1', distanceKm: 1.0, rating: 4.9, acceptanceRate: 0.95, isOnline: true },
    { id: 'c2', distanceKm: 0.5, rating: 4.5, acceptanceRate: 0.80, isOnline: true },
    { id: 'c3', distanceKm: 3.0, rating: 5.0, acceptanceRate: 1.0, isOnline: true },
    { id: 'c4', distanceKm: 0.2, rating: 3.0, acceptanceRate: 0.5, isOnline: false },
  ];

  describe('rankCouriers', () => {
    it('should exclude offline couriers', () => {
      const results = rankCouriers(couriers);
      const ids = results.map((r) => r.courierId);
      expect(ids).not.toContain('c4');
    });

    it('should return couriers sorted by score descending', () => {
      const results = rankCouriers(couriers);
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });

    it('should assign a numeric score to each courier', () => {
      const results = rankCouriers(couriers);
      results.forEach((r) => expect(typeof r.score).toBe('number'));
    });

    it('should return empty array when no online couriers', () => {
      const offline = couriers.map((c) => ({ ...c, isOnline: false }));
      expect(rankCouriers(offline)).toHaveLength(0);
    });
  });

  describe('cascadeOffers', () => {
    it('should return up to maxCascadeDepth courier IDs', () => {
      const ranked = rankCouriers(couriers);
      const ids = cascadeOffers(ranked, 2);
      expect(ids).toHaveLength(2);
    });

    it('should return all available if fewer than maxCascadeDepth', () => {
      const ranked = rankCouriers(couriers);
      const ids = cascadeOffers(ranked, 100);
      expect(ids).toHaveLength(ranked.length);
    });

    it('should cascade in rank order (best first)', () => {
      const ranked = rankCouriers(couriers);
      const ids = cascadeOffers(ranked, 3);
      expect(ids[0]).toBe(ranked[0].courierId);
    });
  });
});
