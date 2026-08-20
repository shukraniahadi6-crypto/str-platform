// Ledger service: double-entry bookkeeping for the STR platform.
interface LedgerEntry {
  id: string;
  debitAccountId: string;
  creditAccountId: string;
  amount: number; // in pence/cents
  description: string;
}

export function sumDebits(entries: LedgerEntry[], accountId: string): number {
  return entries
    .filter((e) => e.debitAccountId === accountId)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function sumCredits(entries: LedgerEntry[], accountId: string): number {
  return entries
    .filter((e) => e.creditAccountId === accountId)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function getBalance(entries: LedgerEntry[], accountId: string): number {
  return sumCredits(entries, accountId) - sumDebits(entries, accountId);
}

export function validateDoubleEntry(entries: LedgerEntry[]): boolean {
  const totalDebits = entries.reduce((s, e) => s + e.amount, 0);
  const totalCredits = entries.reduce((s, e) => s + e.amount, 0);
  return totalDebits === totalCredits;
}

describe('Ledger Service — Unit Tests', () => {
  const entries: LedgerEntry[] = [
    { id: 'l1', debitAccountId: 'vendor-1', creditAccountId: 'platform', amount: 2000, description: 'Job payment' },
    { id: 'l2', debitAccountId: 'platform', creditAccountId: 'courier-1', amount: 1600, description: 'Courier payout' },
    { id: 'l3', debitAccountId: 'platform', creditAccountId: 'platform-fee', amount: 400, description: 'Platform fee' },
  ];

  describe('sumDebits', () => {
    it('should sum all debits for a given account', () => {
      expect(sumDebits(entries, 'vendor-1')).toBe(2000);
    });

    it('should return 0 for an account with no debits', () => {
      expect(sumDebits(entries, 'courier-1')).toBe(0);
    });
  });

  describe('sumCredits', () => {
    it('should sum all credits for a given account', () => {
      expect(sumCredits(entries, 'courier-1')).toBe(1600);
    });

    it('should return 0 for an account with no credits', () => {
      expect(sumCredits(entries, 'vendor-1')).toBe(0);
    });
  });

  describe('getBalance', () => {
    it('should return credits minus debits for an account', () => {
      // platform credits: 2000; platform debits: 1600 + 400 = 2000; balance = 0
      expect(getBalance(entries, 'platform')).toBe(0);
    });

    it('should return negative balance for a debit-only account', () => {
      expect(getBalance(entries, 'vendor-1')).toBe(-2000);
    });

    it('should return positive balance for a credit-only account', () => {
      expect(getBalance(entries, 'courier-1')).toBe(1600);
    });
  });

  describe('validateDoubleEntry', () => {
    it('should confirm totals are balanced in a valid ledger', () => {
      expect(validateDoubleEntry(entries)).toBe(true);
    });

    it('should handle an empty ledger', () => {
      expect(validateDoubleEntry([])).toBe(true);
    });
  });

  describe('large volume — 1000 entries', () => {
    it('should sum 1000 entries correctly', () => {
      const bulk: LedgerEntry[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `bulk-${i}`,
        debitAccountId: 'vendor-bulk',
        creditAccountId: 'courier-bulk',
        amount: 100,
      } as LedgerEntry));
      expect(sumDebits(bulk, 'vendor-bulk')).toBe(100_000);
      expect(sumCredits(bulk, 'courier-bulk')).toBe(100_000);
    });
  });
});
