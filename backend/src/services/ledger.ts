import { Transaction } from '../models/Transaction';

export const recordChargeLedger = async (input: {
  customerId: string;
  courierId: string;
  paymentId: string;
  amount: number;
  commissionAmount: number;
}): Promise<void> => {
  await Transaction.bulkCreate([
    {
      userId: input.customerId,
      referenceId: input.paymentId,
      type: 'debit',
      category: 'charge',
      amount: input.amount,
    },
    {
      userId: input.courierId,
      referenceId: input.paymentId,
      type: 'credit',
      category: 'payout',
      amount: input.amount - input.commissionAmount,
    },
  ]);
};

export const getLedgerForUser = async (userId: string): Promise<Transaction[]> => {
  return Transaction.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
};
