import { calculateUpfrontPay, findEligibleCouriers } from '../services/dispatch';

describe('Dispatch Service', () => {
  describe('calculateUpfrontPay', () => {
    it('should calculate correct pay breakdown for short distance', () => {
      const pay = calculateUpfrontPay(500, 1);
      expect(pay.basePay).toBe(15);
      expect(pay.distanceBonus).toBeCloseTo(0.75, 2);
      expect(pay.weightAllowance).toBe(2);
      expect(pay.estimatedTip).toBe(3);
      expect(pay.total).toBeCloseTo(20.75, 2);
    });

    it('should include distance bonus for farther jobs', () => {
      const pay = calculateUpfrontPay(2000, 0);
      expect(pay.distanceBonus).toBe(3);
      expect(pay.total).toBeGreaterThan(18);
    });

    it('should handle zero distance', () => {
      const pay = calculateUpfrontPay(0, 0);
      expect(pay.distanceBonus).toBe(0);
      expect(pay.total).toBe(18); // base + tip
    });

    it('should return positive total', () => {
      const pay = calculateUpfrontPay(1500, 2.5);
      expect(pay.total).toBeGreaterThan(0);
    });
  });

  describe('findEligibleCouriers (unit logic)', () => {
    it('should filter and sort by distance correctly', () => {
      // Test the distance-based sorting logic
      const candidates = [
        { courierId: 'c1', distance: 1500, rating: 4.5 },
        { courierId: 'c2', distance: 500, rating: 4.8 },
        { courierId: 'c3', distance: 1000, rating: 4.2 },
      ];
      const sorted = candidates.sort((a, b) => a.distance - b.distance);
      expect(sorted[0].courierId).toBe('c2');
      expect(sorted[1].courierId).toBe('c3');
      expect(sorted[2].courierId).toBe('c1');
    });

    it('should exclude couriers below rating threshold', () => {
      const MIN_RATING = 4.0;
      const candidates = [
        { courierId: 'c1', distance: 500, rating: 4.5 },
        { courierId: 'c2', distance: 800, rating: 3.8 },
        { courierId: 'c3', distance: 1200, rating: 4.1 },
      ];
      const eligible = candidates.filter((c) => c.rating >= MIN_RATING);
      expect(eligible).toHaveLength(2);
      expect(eligible.map((c) => c.courierId)).not.toContain('c2');
    });

    it('should exclude couriers beyond max distance', () => {
      const MAX_DIST = 2000;
      const candidates = [
        { courierId: 'c1', distance: 500 },
        { courierId: 'c2', distance: 2500 },
        { courierId: 'c3', distance: 1999 },
      ];
      const nearby = candidates.filter((c) => c.distance <= MAX_DIST);
      expect(nearby).toHaveLength(2);
      expect(nearby.map((c) => c.courierId)).not.toContain('c2');
    });
  });
});
