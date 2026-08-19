import { Request, Response } from 'express';
import { Payment } from '../models';
import { chargeCompletedJob, createStripeCustomer, refundPayment } from '../services/payment';

export const createStripeCustomerController = async (req: Request, res: Response): Promise<void> => {
  const customer = await createStripeCustomer(req.body.email);
  res.status(201).json(customer);
};

export const chargeController = async (req: Request, res: Response): Promise<void> => {
  const payment = await chargeCompletedJob(req.body);
  res.status(201).json(payment);
};

export const refundController = async (req: Request, res: Response): Promise<void> => {
  const payment = await refundPayment(String(req.params.paymentId));
  res.json(payment);
};

export const listPaymentsController = async (_req: Request, res: Response): Promise<void> => {
  const payments = await Payment.findAll({ order: [['createdAt', 'DESC']] });
  res.json(payments);
};
