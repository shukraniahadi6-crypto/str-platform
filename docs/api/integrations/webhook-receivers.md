# Webhook Receivers & Event Types

## Overview

STR Platform emits webhooks to your configured endpoint when important platform events occur.

## Configuration

Register a webhook URL in the admin console under **Settings → Webhooks** or via the API:

```http
POST /api/v1/admin/webhooks
{
  "url": "https://yourapp.com/webhooks/str",
  "events": ["job.completed", "payout.paid", "dispute.opened"],
  "secret": "whsec_your_signing_secret"
}
```

## Webhook Payload Format

```json
{
  "id": "evt_01HXYZ",
  "type": "job.completed",
  "createdAt": "2025-01-15T15:30:00Z",
  "data": { ... }
}
```

## Signature Verification

```typescript
import crypto from "crypto";

function verifyWebhookSignature(
  rawBody: Buffer,
  signature: string,
  secret: string
): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
}

app.post("/webhooks/str", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["x-str-signature"] as string;
  if (!verifyWebhookSignature(req.body, sig, process.env.STR_WEBHOOK_SECRET!)) {
    return res.status(400).send("Invalid signature");
  }
  const event = JSON.parse(req.body.toString());
  handleEvent(event);
  res.json({ received: true });
});
```

## Event Types

| Event | Description | Data |
|---|---|---|
| `job.created` | New job posted | `Job` object |
| `job.accepted` | Hauler accepted job | `Job` object |
| `job.completed` | Job completed and disposal verified | `Job` + `GreenImpact` |
| `job.cancelled` | Job cancelled | `Job` + `reason` |
| `payout.initiated` | Payout requested by courier | `Payout` object |
| `payout.paid` | Payout confirmed by Stripe | `Payout` object |
| `dispute.opened` | Customer opened a dispute | `Dispute` object |
| `dispute.resolved` | Admin resolved dispute | `Dispute` + `resolution` |
| `sds.case_flagged` | Hazardous material detected | `SDSCase` object |
| `user.verified` | Courier verification approved | `UserProfile` |

## Retry Policy

- Webhooks are retried up to **5 times** with exponential backoff (5s, 25s, 125s, 625s, 3125s).
- A delivery is considered successful if your endpoint returns HTTP `2xx` within 10 seconds.
- Failed deliveries are visible in the admin console under **Settings → Webhooks → Delivery Log**.
