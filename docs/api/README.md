# STR Platform API — Overview

## Base URL

| Environment | URL |
|---|---|
| Production | `https://api.strplatform.com/api/v1` |
| Staging | `https://staging-api.strplatform.com/api/v1` |
| Local | `http://localhost:4000/api/v1` |

## Authentication

All protected endpoints require a ****** in the `Authorization` header:

```
Authorization: ******
```

Tokens expire in **15 minutes**. Use the `/auth/refresh` endpoint to obtain a new access token using a refresh token (7-day TTL).

## API Versioning

The API is versioned via the URL path (`/api/v1`). See [Versioning Guide](deployment/versioning.md) for backward-compatibility policy.

## Response Format

All responses use `application/json`. Successful responses return the resource or list directly. Errors follow the standard [Error format](errors/error-codes.md).

## Rate Limiting

| Tier | Requests/minute |
|---|---|
| Free | 60 |
| Pro | 300 |
| Enterprise | 1200 |

Rate limit headers are included on every response:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1721234567
```

## Pagination

List endpoints support cursor-based pagination via `cursor` and `limit` query parameters. The response includes a `pagination` object:

```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "limit": 20,
    "hasNext": true,
    "cursor": "eyJpZCI6IjEyMyJ9"
  }
}
```

## Endpoint Groups

| Tag | Description | Reference |
|---|---|---|
| `auth` | JWT auth & token management | [auth-endpoints.md](endpoints/auth-endpoints.md) |
| `users` | User profiles & verification | [user-endpoints.md](endpoints/user-endpoints.md) |
| `jobs` | Job lifecycle & AI estimate | [job-endpoints.md](endpoints/job-endpoints.md) |
| `offers` | Offer pings & bidding | [offer-endpoints.md](endpoints/offer-endpoints.md) |
| `tracking` | Live GPS tracking | [tracking-endpoints.md](endpoints/tracking-endpoints.md) |
| `batches` | Neighborhood batching | [batch-endpoints.md](endpoints/batch-endpoints.md) |
| `upcycle` | Upcycling & green impact | [upcycle-endpoints.md](endpoints/upcycle-endpoints.md) |
| `ledger` | Financial ledger & payouts | [ledger-endpoints.md](endpoints/ledger-endpoints.md) |
| `sds` | Safety & hazard detection | [sds-endpoints.md](endpoints/sds-endpoints.md) |
| `academy` | Training courses & badges | [academy-endpoints.md](endpoints/academy-endpoints.md) |
| `admin` | Admin & HQ operations | [admin-endpoints.md](endpoints/admin-endpoints.md) |

## Machine-Readable Spec

- **OpenAPI 3.0 YAML**: [`openapi.yaml`](openapi.yaml)
- **Swagger UI**: served at `/api-docs` in development

## Quick Links

- [Authentication Guide](auth/authentication.md)
- [Authorization & RBAC](auth/authorization.md)
- [WebSocket Events](websocket/events.md)
- [Error Code Reference](errors/error-codes.md)
- [Postman Collection](examples/postman-collection.json)
- [TypeScript SDK](sdks/typescript-sdk.md)
