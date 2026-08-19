import { AppDataSource } from '../core/database';
import { LedgerEntry, TransactionType, VendorAccount, CourierAccount, Payment, Payout } from '../models/Ledger';
import { NotFoundError, AppError } from '../utils/errors';

const ledgerRepo = () => AppDataSource.getRepository(LedgerEntry);
const vendorRepo = () => AppDataSource.getRepository(VendorAccount);
const courierRepo = () => AppDataSource.getRepository(CourierAccount);
const paymentRepo = () => AppDataSource.getRepository(Payment);
const payoutRepo = () => AppDataSource.getRepository(Payout);

export async function chargeVendor(
  vendorId: string,
  amount: number,
  jobId: string,
  stripeChargeId: string
): Promise<void> {
  await AppDataSource.transaction(async (manager) => {
    // Debit vendor account
    await manager.save(LedgerEntry, manager.create(LedgerEntry, {
      account_id: vendorId,
      debit_amount: amount,
      credit_amount: 0,
      transaction_type: TransactionType.VENDOR_CHARGE,
      job_id: jobId,
      description: `Charge for job ${jobId}`,
    }));
    // Credit platform account
    await manager.save(LedgerEntry, manager.create(LedgerEntry, {
      account_id: 'PLATFORM',
      debit_amount: 0,
      credit_amount: amount,
      transaction_type: TransactionType.VENDOR_CHARGE,
      job_id: jobId,
      description: `Platform credit for job ${jobId}`,
    }));

    // Update vendor account total
    await manager
      .createQueryBuilder()
      .update(VendorAccount)
      .set({
        total_charged: () => `total_charged + ${amount}`,
      })
      .where('user_id = :userId', { userId: vendorId })
      .execute();

    // Record payment
    await manager.save(Payment, manager.create(Payment, {
      vendor_id: vendorId,
      job_id: jobId,
      stripe_charge_id: stripeChargeId,
      amount,
      status: 'COMPLETED',
    }));
  });
}

export async function payCourier(
  courierId: string,
  amount: number,
  jobId: string,
  type: TransactionType = TransactionType.COURIER_PAYOUT
): Promise<void> {
  await AppDataSource.transaction(async (manager) => {
    // Debit platform
    await manager.save(LedgerEntry, manager.create(LedgerEntry, {
      account_id: 'PLATFORM',
      debit_amount: amount,
      credit_amount: 0,
      transaction_type: type,
      job_id: jobId,
    }));
    // Credit courier
    await manager.save(LedgerEntry, manager.create(LedgerEntry, {
      account_id: courierId,
      debit_amount: 0,
      credit_amount: amount,
      transaction_type: type,
      job_id: jobId,
    }));

    // Update courier account
    const updateObj: Record<string, any> = {
      balance: () => `balance + ${amount}`,
      total_earned: () => `total_earned + ${amount}`,
    };
    if (type === TransactionType.TIP) {
      updateObj.tips_earned = () => `tips_earned + ${amount}`;
    } else if (type === TransactionType.UPCYCLE_BONUS) {
      updateObj.upcycle_bonus_earned = () => `upcycle_bonus_earned + ${amount}`;
    }

    await manager
      .createQueryBuilder()
      .update(CourierAccount)
      .set(updateObj)
      .where('user_id = :userId', { userId: courierId })
      .execute();
  });
}

export async function getVendorBalance(userId: string): Promise<VendorAccount> {
  const account = await vendorRepo().findOne({ where: { user_id: userId } });
  if (!account) throw new NotFoundError('VendorAccount');
  return account;
}

export async function getCourierBalance(userId: string): Promise<CourierAccount> {
  const account = await courierRepo().findOne({ where: { user_id: userId } });
  if (!account) throw new NotFoundError('CourierAccount');
  return account;
}

export async function getLedgerHistory(
  accountId: string,
  limit = 20,
  offset = 0
): Promise<{ entries: LedgerEntry[]; total: number }> {
  const [entries, total] = await ledgerRepo().findAndCount({
    where: { account_id: accountId },
    order: { created_at: 'DESC' },
    take: limit,
    skip: offset,
  });
  return { entries, total };
}

export async function verifyLedger(): Promise<{ balanced: boolean; totalDebits: number; totalCredits: number; discrepancy: number }> {
  const result = await ledgerRepo()
    .createQueryBuilder('entry')
    .select('SUM(entry.debit_amount)', 'totalDebits')
    .addSelect('SUM(entry.credit_amount)', 'totalCredits')
    .getRawOne();

  const totalDebits = parseFloat(result?.totalDebits || '0');
  const totalCredits = parseFloat(result?.totalCredits || '0');
  const discrepancy = Math.abs(totalDebits - totalCredits);

  return {
    balanced: discrepancy < 0.01,
    totalDebits,
    totalCredits,
    discrepancy,
  };
}

export async function requestCashout(courierId: string, amount: number): Promise<Payout> {
  const account = await courierRepo().findOne({ where: { user_id: courierId } });
  if (!account) throw new NotFoundError('CourierAccount');
  if (account.balance < amount) throw new AppError('Insufficient balance', 400, 'INSUFFICIENT_BALANCE');
  if (!account.instant_cashout_enabled) throw new AppError('Instant cashout not enabled', 400, 'CASHOUT_DISABLED');

  return payoutRepo().save(payoutRepo().create({
    courier_id: courierId,
    amount,
    status: 'PENDING',
  }));
}
