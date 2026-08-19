import { AppDataSource } from '../core/database';
import { Payout } from '../models/Ledger';
import { CourierAccount } from '../models/Ledger';
import { getStripeClient } from '../core/stripe';
import { NotFoundError, AppError } from '../utils/errors';
import { logger } from '../utils/logger';

const payoutRepo = () => AppDataSource.getRepository(Payout);
const courierRepo = () => AppDataSource.getRepository(CourierAccount);

export async function processInstantCashout(payoutId: string): Promise<Payout> {
  const payout = await payoutRepo().findOne({ where: { id: payoutId } });
  if (!payout) throw new NotFoundError('Payout');
  if (payout.status !== 'PENDING') throw new AppError('Payout already processed', 400, 'PAYOUT_PROCESSED');

  const account = await courierRepo().findOne({ where: { user_id: payout.courier_id } });
  if (!account?.stripe_connect_account_id) {
    throw new AppError('Stripe Connect account not set up', 400, 'NO_STRIPE_ACCOUNT');
  }

  try {
    const stripe = getStripeClient();
    const transfer = await stripe.transfers.create({
      amount: Math.round(Number(payout.amount) * 100), // cents
      currency: 'usd',
      destination: account.stripe_connect_account_id,
      metadata: { payout_id: payoutId, courier_id: payout.courier_id },
    });

    payout.stripe_payout_id = transfer.id;
    payout.status = 'COMPLETED';
    payout.completed_at = new Date();

    // Deduct from courier balance
    await AppDataSource
      .createQueryBuilder()
      .update(CourierAccount)
      .set({ balance: () => `balance - ${payout.amount}` })
      .where('user_id = :userId', { userId: payout.courier_id })
      .execute();
  } catch (err) {
    logger.error('Stripe payout failed', { payoutId, error: err });
    payout.status = 'FAILED';
  }

  return payoutRepo().save(payout);
}
