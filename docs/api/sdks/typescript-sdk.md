# TypeScript SDK Guide

## Installation

```bash
npm install @str-platform/sdk
# or
yarn add @str-platform/sdk
```

> The SDK is auto-generated from `openapi.yaml` using `openapi-typescript-codegen`.

## Quick Start

```typescript
import { STRClient } from "@str-platform/sdk";

const client = new STRClient({
  baseURL: "https://api.strplatform.com/api/v1",
  accessToken: () => localStorage.getItem("accessToken") ?? "",
});

// List jobs
const { data: jobs } = await client.jobs.list({ status: "pending" });

// Create an estimate
const estimate = await client.jobs.estimate({
  imageUrls: ["https://..."],
  address: "123 Elm St, Austin TX",
});

// Create a job
const job = await client.jobs.create({
  estimateId: estimate.estimateId,
  addressId: "addr_001",
  scheduledAt: new Date().toISOString(),
});
```

## Authentication

```typescript
import { STRClient, AuthService } from "@str-platform/sdk";

const auth = new AuthService({ baseURL: "https://api.strplatform.com/api/v1" });

// Login
const tokens = await auth.login({ email: "jane@example.com", password: "..." });
localStorage.setItem("accessToken", tokens.accessToken);
localStorage.setItem("refreshToken", tokens.refreshToken);

// Client auto-refreshes tokens
const client = new STRClient({
  baseURL: "https://api.strplatform.com/api/v1",
  accessToken: () => localStorage.getItem("accessToken") ?? "",
  onTokenExpired: async () => {
    const refreshed = await auth.refresh({
      refreshToken: localStorage.getItem("refreshToken")!,
    });
    localStorage.setItem("accessToken", refreshed.accessToken);
    localStorage.setItem("refreshToken", refreshed.refreshToken);
    return refreshed.accessToken;
  },
});
```

## Available Services

| Service | Methods |
|---|---|
| `client.auth` | `login`, `register`, `refresh`, `logout` |
| `client.users` | `getMe`, `updateMe`, `updatePreferences`, `verify` |
| `client.jobs` | `estimate`, `create`, `list`, `get`, `cancel` |
| `client.offers` | `listActive`, `accept`, `decline` |
| `client.tracking` | `getSnapshot`, `updateLocation` |
| `client.batches` | `findNearby`, `join` |
| `client.ledger` | `getBalance`, `listEntries`, `requestPayout` |
| `client.sds` | `analyze` |
| `client.academy` | `listCourses`, `getCourse`, `complete`, `getBadges` |
| `client.admin` | `listUsers`, `listJobs`, `getAnalytics`, `resolveDispute` |

## Error Handling

```typescript
import { STRAPIError } from "@str-platform/sdk";

try {
  const job = await client.jobs.get("nonexistent");
} catch (err) {
  if (err instanceof STRAPIError) {
    console.error(err.code);    // "JOB_NOT_FOUND"
    console.error(err.status);  // 404
    console.error(err.message); // "No job found with the given ID."
  }
}
```

## Real-Time SDK

```typescript
import { STRRealtimeClient } from "@str-platform/sdk/realtime";

const realtime = new STRRealtimeClient({
  wsURL: "wss://api.strplatform.com",
  accessToken: () => localStorage.getItem("accessToken") ?? "",
});

realtime.onJobStatusChanged((event) => {
  console.log(`Job ${event.jobId}: ${event.status}`);
});

realtime.onLocationUpdate((event) => {
  updateMapMarker(event.lat, event.lng);
});

realtime.joinJob("job_abc123");
```

## Generating the SDK

The SDK is generated from the OpenAPI spec:

```bash
npx openapi-typescript-codegen \
  --input docs/api/openapi.yaml \
  --output packages/sdk/src \
  --client axios \
  --useOptions \
  --useUnionTypes
```
