# JavaScript SDK Guide

## Installation

```bash
npm install @str-platform/sdk
```

The JavaScript SDK is the same package as the TypeScript SDK — it ships CommonJS and ESM builds with TypeScript type declarations.

## CommonJS Usage

```javascript
const { STRClient } = require("@str-platform/sdk");

const client = new STRClient({
  baseURL: "https://api.strplatform.com/api/v1",
  accessToken: () => process.env.STR_ACCESS_TOKEN,
});

async function main() {
  const jobs = await client.jobs.list({ status: "completed" });
  console.log(jobs.data);
}

main().catch(console.error);
```

## ESM Usage

```javascript
import { STRClient } from "@str-platform/sdk";

const client = new STRClient({
  baseURL: "https://api.strplatform.com/api/v1",
  accessToken: () => process.env.STR_ACCESS_TOKEN,
});

const balance = await client.ledger.getBalance();
console.log(`Available: $${balance.available}`);
```

## Node.js Server-Side Example

```javascript
import { STRClient, AuthService } from "@str-platform/sdk";

// Authenticate with API key (server-to-server)
const client = new STRClient({
  baseURL: "https://api.strplatform.com/api/v1",
  apiKey: process.env.STR_API_KEY,
});

// Admin: get analytics
const analytics = await client.admin.getAnalytics();
console.log(`Total jobs: ${analytics.totalJobs}`);
console.log(`CO2 saved: ${analytics.co2SavedKg} kg`);
```

## See Also

- [TypeScript SDK Guide](typescript-sdk.md) — full feature documentation
- [OpenAPI Spec](../openapi.yaml) — machine-readable API contract
