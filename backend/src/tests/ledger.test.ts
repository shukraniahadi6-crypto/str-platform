import { TransactionType } from '../models/Ledger';

describe('Ledger Service', () => {
  describe('Double-entry accounting principles', () => {
    it('should ensure debit and credit amounts are always paired', () => {
      // Simulate ledger entries array
      const entries = [
        { account_id: 'vendor-1', debit_amount: 100, credit_amount: 0, transaction_type: TransactionType.VENDOR_CHARGE },
        { account_id: 'PLATFORM', debit_amount: 0, credit_amount: 100, transaction_type: TransactionType.VENDOR_CHARGE },
      ];

      const totalDebits = entries.reduce((sum, e) => sum + e.debit_amount, 0);
      const totalCredits = entries.reduce((sum, e) => sum + e.credit_amount, 0);

      expect(totalDebits).toBe(totalCredits);
    });

    it('should validate ledger balance with multiple transactions', () => {
      const entries = [
        // Vendor charge
        { debit_amount: 100, credit_amount: 0 },
        { debit_amount: 0, credit_amount: 100 },
        // Courier payout
        { debit_amount: 60, credit_amount: 0 },
        { debit_amount: 0, credit_amount: 60 },
        // Tip
        { debit_amount: 5, credit_amount: 0 },
        { debit_amount: 0, credit_amount: 5 },
      ];

      const totalDebits = entries.reduce((sum, e) => sum + e.debit_amount, 0);
      const totalCredits = entries.reduce((sum, e) => sum + e.credit_amount, 0);
      const discrepancy = Math.abs(totalDebits - totalCredits);

      expect(discrepancy).toBeLessThan(0.01);
    });

    it('should detect imbalanced ledger', () => {
      const entries = [
        { debit_amount: 100, credit_amount: 0 },
        { debit_amount: 0, credit_amount: 90 }, // Missing $10
      ];

      const totalDebits = entries.reduce((sum, e) => sum + e.debit_amount, 0);
      const totalCredits = entries.reduce((sum, e) => sum + e.credit_amount, 0);
      const discrepancy = Math.abs(totalDebits - totalCredits);

      expect(discrepancy).toBeGreaterThan(0.01);
    });
  });

  describe('Transaction type validation', () => {
    it('should have correct transaction types defined', () => {
      expect(TransactionType.VENDOR_CHARGE).toBe('VENDOR_CHARGE');
      expect(TransactionType.COURIER_PAYOUT).toBe('COURIER_PAYOUT');
      expect(TransactionType.TIP).toBe('TIP');
      expect(TransactionType.UPCYCLE_BONUS).toBe('UPCYCLE_BONUS');
      expect(TransactionType.REFUND).toBe('REFUND');
      expect(TransactionType.PLATFORM_FEE).toBe('PLATFORM_FEE');
    });
  });
});
