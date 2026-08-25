import { stripe } from '../config/stripe';
import { env } from '../config/env';
import { Job, Payment } from '../models';
import { AppError } from '../utils/errors';
import { recordChargeLedger } from './ledger';

const usdToCents = (amount: number): number => Math.round(amount * 100);

export const createStripeCustomer = async (email: string): Promise<{ id: string }> => {
  if (!stripe) return { id: `cus_mock_${email}` };
  const customer = await stripe.customers.create({ email });
  return { id: customer.id };
};

export const chargeCompletedJob = async (input: {
  jobId: string;
  customerId: string;
  courierId: string;
  amount: number;
  paymentMethodId?: string;
}): Promise<Payment> => {
  const job = await Job.findByPk(input.jobId);
  if (!job) throw new AppError(404, 'Job not found');
  if (job.status !== 'completed') throw new AppError(409, 'Job must be completed before charge');

  let paymentIntentId: string | null = null;
  if (stripe) {
    const intent = await stripe.paymentIntents.create({
      amount: usdToCents(input.amount),
      currency: 'usd',
      payment_method: input.paymentMethodId,
      confirm: !!input.paymentMethodId,
      automatic_payment_methods: input.paymentMethodId ? undefined : { enabled: true },
    });
    paymentIntentId = intent.id;
  }

  const payment = await Payment.create({
    jobId: input.jobId,
    customerId: input.customerId,
    courierId: input.courierId,
    amount: input.amount,
    stripePaymentIntentId: paymentIntentId,
  });

  const commissionAmount = (env.PLATFORM_FEE_PERCENT / 100) * input.amount;
  await recordChargeLedger({
    customerId: input.customerId,
    courierId: input.courierId,
    paymentId: payment.id,
    amount: input.amount,
    commissionAmount,
  });

  return payment;
};

export const refundPayment = async (paymentId: string): Promise<Payment> => {
  const payment = await Payment.findByPk(paymentId);
  if (!payment) throw new AppError(404, 'Payment not found');
  if (payment.status === 'refunded') return payment;

  if (stripe && payment.stripePaymentIntentId) {
    await stripe.refunds.create({ payment_intent: payment.stripePaymentIntentId });
  }

  payment.status = 'refunded';
  await payment.save();
  return payment;
};
