# Stripe Connect Integration Guide

## Overview

STR Platform uses **Stripe Connect** to:
- Charge customers for jobs (direct charges)
- Hold funds in escrow during job execution
- Pay out couriers instantly after completion
- Handle tips and karma bonuses

## Setup

### 1. Create a Stripe Connect Account

Every courier must create a connected Stripe Express account:

```typescript
// Backend: create Express account & return onboarding URL
const account = await stripe.accounts.create({ type: "express" });

const accountLink = await stripe.accountLinks.create({
  account: account.id,
  refresh_url: "https://app.strplatform.com/courier/stripe/refresh",
  return_url: "https://app.strplatform.com/courier/stripe/complete",
  type: "account_onboarding",
});

// Redirect courier to accountLink.url
```

### 2. Save Account ID

Store `account.id` in the courier's profile:

```sql
UPDATE users SET stripe_account_id = $1 WHERE id = $2;
```

### 3. Customer Payment Methods

Customers attach payment methods via Stripe's Payment Element:

```typescript
const setupIntent = await stripe.setupIntents.create({
  customer: user.stripeCustomerId,
  payment_method_types: ["card"],
});
// Return setupIntent.client_secret to frontend
```

## Charging a Customer (Job Payment)

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(job.estimatedPrice * 100), // cents
  currency: "usd",
  customer: job.customer.stripeCustomerId,
  payment_method: job.customer.defaultPaymentMethodId,
  capture_method: "manual", // Authorize, don't capture until job complete
  metadata: { jobId: job.id },
  application_fee_amount: Math.round(job.estimatedPrice * 0.25 * 100), // 25% platform fee
  transfer_data: {
    destination: job.courier.stripeAccountId,
  },
  confirm: true,
  off_session: true,
});
```

## Capturing Payment After Completion

```typescript
await stripe.paymentIntents.capture(job.stripePaymentIntentId);
```

## Instant Payout to Courier

```typescript
await stripe.payouts.create(
  {
    amount: Math.round(payoutAmount * 100),
    currency: "usd",
    method: "instant",
  },
  { stripeAccount: courier.stripeAccountId }
);
```

## Webhook Handling

Stripe sends events to `/webhooks/stripe`. Register this URL in your Stripe dashboard.

```typescript
app.post("/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

  switch (event.type) {
    case "payment_intent.succeeded":
      await handlePaymentSuccess(event.data.object);
      break;
    case "payment_intent.payment_failed":
      await handlePaymentFailure(event.data.object);
      break;
    case "payout.paid":
      await handlePayoutConfirmed(event.data.object);
      break;
  }

  res.json({ received: true });
});
```

## Common Gotchas

| Issue | Solution |
|---|---|
| "No such customer" | Ensure `stripeCustomerId` is created before first charge |
| Instant payout unavailable | Courier's debit card must support instant payouts; fall back to standard |
| Webhook signature failure | Use `express.raw()` middleware, not `express.json()`, for webhook route |
| Application fee exceeds charge | Fee must be ≤ charge amount; validate before creating PaymentIntent |

## Useful Links

- [Stripe Connect Docs](https://stripe.com/docs/connect)
- [Stripe Express Accounts](https://stripe.com/docs/connect/express-accounts)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
