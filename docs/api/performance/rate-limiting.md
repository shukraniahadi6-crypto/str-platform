# Rate Limiting Guide

## Overview

API rate limits are enforced per authenticated user (by `sub` claim in JWT) and per IP for unauthenticated endpoints.

## Rate Limit Tiers

| Tier | Requests/Minute | Burst | Who |
|---|---|---|---|
| **Free** | 60 | 80 | Default for all users |
| **Pro** | 300 | 400 | Verified couriers & customers |
| **Enterprise** | 1200 | 1500 | Business integrations (API key) |
| **Admin** | Unlimited | — | Admin role users |

## Rate Limit Headers

Every response includes:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1721234567
Retry-After: 18       (only on 429 responses)
```

| Header | Description |
|---|---|
| `X-RateLimit-Limit` | Maximum requests allowed in the window |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | Unix timestamp when the window resets |
| `Retry-After` | Seconds to wait before retrying (on 429) |

## Endpoint-Specific Limits

Some endpoints have stricter limits independent of the tier:

| Endpoint | Limit |
|---|---|
| `POST /auth/login` | 10/min per IP |
| `POST /auth/register` | 5/min per IP |
| `POST /jobs/estimate` | 20/hour per user |
| `POST /jobs` | 10/hour per user |
| `POST /sds/analyze` | 30/hour per user |
| `POST /ledger/payout` | 5/hour per user |
| `POST /users/me/verify` | 5/hour per user |

## Handling 429 Responses

```typescript
async function requestWithBackoff<T>(fn: () => Promise<T>): Promise<T> {
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const res = (err as AxiosError).response;
      if (res?.status === 429) {
        const retryAfter = parseInt(res.headers["retry-after"] ?? "60", 10);
        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, retryAfter * 1000));
          continue;
        }
      }
      throw err;
    }
  }
  throw new Error("Unreachable");
}
```

## Usage Monitoring

Current usage is visible in the admin console at **Settings → API Usage** and via the response headers on every request.
