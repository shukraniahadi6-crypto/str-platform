import Stripe from 'stripe';
import { config } from './config';

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(config.stripe.secretKey, {
      apiVersion: '2025-06-30.basil',
    });
  }
  return stripeClient;
}
