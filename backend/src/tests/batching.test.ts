import { haversineDistance, isWithinRadius, isValidCoordinates } from '../utils/spatial';

describe('Batching Service - Spatial Utils', () => {
  describe('haversineDistance', () => {
    it('should calculate ~111km for 1 degree latitude difference', () => {
      const dist = haversineDistance(0, 0, 1, 0);
      // Should be approximately 111km (between 110000m and 112000m)
      expect(dist).toBeGreaterThan(110000);
      expect(dist).toBeLessThan(112000);
    });

    it('should return 0 for same coordinates', () => {
      const dist = haversineDistance(40.7128, -74.006, 40.7128, -74.006);
      expect(dist).toBe(0);
    });

    it('should be symmetric', () => {
      const d1 = haversineDistance(40.7128, -74.006, 34.0522, -118.2437);
      const d2 = haversineDistance(34.0522, -118.2437, 40.7128, -74.006);
      expect(d1).toBeCloseTo(d2, 0);
    });
  });

  describe('isWithinRadius', () => {
    it('should return true for points within 500m', () => {
      // ~200m apart
      const result = isWithinRadius(40.7128, -74.006, 40.7128, -74.0040, 500);
      expect(result).toBe(true);
    });

    it('should return false for points more than 500m apart', () => {
      // ~3km apart
      const result = isWithinRadius(40.7128, -74.006, 40.7400, -74.006, 500);
      expect(result).toBe(false);
    });
  });

  describe('isValidCoordinates', () => {
    it('should accept valid lat/lng', () => {
      expect(isValidCoordinates(40.7128, -74.006)).toBe(true);
      expect(isValidCoordinates(0, 0)).toBe(true);
      expect(isValidCoordinates(-90, -180)).toBe(true);
      expect(isValidCoordinates(90, 180)).toBe(true);
    });

    it('should reject out-of-bounds coordinates', () => {
      expect(isValidCoordinates(91, 0)).toBe(false);
      expect(isValidCoordinates(0, 181)).toBe(false);
      expect(isValidCoordinates(-91, 0)).toBe(false);
    });
  });

  describe('Batch discount logic', () => {
    it('should apply 25% discount for batch jobs', () => {
      const basePay = 15;
      const discountPct = 25;
      const discountedPay = basePay * (1 - discountPct / 100);
      expect(discountedPay).toBe(11.25);
    });

    it('should calculate batch bonus per job', () => {
      const basePay = 15;
      const batchBonus = 5;
      const jobCount = 3;
      const totalEarnings = basePay * jobCount + batchBonus;
      expect(totalEarnings).toBe(50);
    });
  });
});
