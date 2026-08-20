// Green impact calculator for STR Platform.
// 1 job = average 2.5 kg CO2 saved vs car. 21 kg CO2 absorbed per tree per year.

const CO2_PER_JOB_KG = 2.5;
const CO2_PER_TREE_PER_YEAR_KG = 21;

export function calculateCO2SavedKg(jobCount: number): number {
  return jobCount * CO2_PER_JOB_KG;
}

export function calculateTreeEquivalence(co2Kg: number): number {
  return co2Kg / CO2_PER_TREE_PER_YEAR_KG;
}

export function generateGreenReceipt(jobCount: number) {
  const co2Saved = calculateCO2SavedKg(jobCount);
  const treeEquiv = calculateTreeEquivalence(co2Saved);
  return {
    jobCount,
    co2SavedKg: co2Saved,
    treeEquivalence: parseFloat(treeEquiv.toFixed(2)),
    message: `You saved ${co2Saved.toFixed(1)} kg of CO₂ — equivalent to ${treeEquiv.toFixed(2)} trees for a year!`,
  };
}

describe('Green Impact Calculator — Unit Tests', () => {
  describe('calculateCO2SavedKg', () => {
    it('should return 0 for 0 jobs', () => {
      expect(calculateCO2SavedKg(0)).toBe(0);
    });

    it('should calculate CO2 for a single job', () => {
      expect(calculateCO2SavedKg(1)).toBe(2.5);
    });

    it('should scale linearly with job count', () => {
      expect(calculateCO2SavedKg(100)).toBe(250);
    });
  });

  describe('calculateTreeEquivalence', () => {
    it('should return correct tree equivalence', () => {
      const result = calculateTreeEquivalence(21);
      expect(result).toBe(1);
    });

    it('should handle fractional results', () => {
      const result = calculateTreeEquivalence(10.5);
      expect(result).toBeCloseTo(0.5, 5);
    });
  });

  describe('generateGreenReceipt', () => {
    it('should return a complete receipt object', () => {
      const receipt = generateGreenReceipt(10);
      expect(receipt).toHaveProperty('jobCount', 10);
      expect(receipt).toHaveProperty('co2SavedKg', 25);
      expect(receipt).toHaveProperty('treeEquivalence');
      expect(receipt).toHaveProperty('message');
      expect(typeof receipt.message).toBe('string');
    });

    it('receipt message should mention CO2 saved', () => {
      const receipt = generateGreenReceipt(4);
      expect(receipt.message).toContain('CO₂');
    });
  });
});
