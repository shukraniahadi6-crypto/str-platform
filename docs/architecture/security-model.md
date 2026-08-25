# Security Model

## Authentication

- All API endpoints (except `/auth/*`) require a valid JWT in the `Authorization: ******` header.
- Access tokens expire in **15 minutes** (short TTL limits damage from token theft).
- Refresh tokens expire in **7 days** with rotation on each use.
- Tokens are signed with HS256 using a secret stored in environment variables, never in code.

## Transport Security

- All traffic is encrypted over **TLS 1.2+**. HTTP is rejected.
- WebSocket connections use **WSS** (TLS encrypted).
- Strict HSTS headers (`Strict-Transport-Security: max-age=63072000; includeSubDomains`).

## Input Validation

- All request bodies are validated against JSON schemas using `zod` or `express-validator`.
- Malformed or unexpected payloads return `422 VALIDATION_ERROR` before reaching business logic.
- SQL injection is prevented by exclusive use of parameterized queries (no string concatenation).
- File upload URLs are validated against an allowlist of trusted S3/GCS domains.

## Rate Limiting & DDoS Protection

- Rate limiting via Redis token bucket algorithm (see [rate-limiting.md](../api/performance/rate-limiting.md)).
- Auth endpoints have stricter per-IP limits (10/min) to prevent brute force.
- CloudFlare or AWS WAF in front of production API.

## Authorization

- Role-Based Access Control (RBAC) enforced in middleware on every request.
- Resource ownership checks prevent customers accessing other customers' jobs.
- Admin-only endpoints (`/admin/*`) require `role: admin` claim in JWT.

## Payment Security

- Customer payment method details never touch STR servers — Stripe.js handles card tokenization.
- Payment intents use `capture_method: manual` to authorize without charging until job completion.
- Webhook signatures are verified with HMAC-SHA256 before processing.

## Data Privacy

- Passwords are hashed with `bcrypt` (cost factor 12) before storage.
- Refresh tokens are stored as hashed values; raw tokens never persisted.
- PII (names, emails, phone numbers) is encrypted at rest using PostgreSQL column-level encryption.
- Driver's license images stored in S3 with server-side encryption (SSE-S3).

## Secrets Management

- All secrets (API keys, database passwords) stored in environment variables or a secrets manager (AWS Secrets Manager / HashiCorp Vault).
- No secrets committed to source code.
- Secrets rotated on a quarterly basis.

## Audit Logging

- All authenticated API requests are logged with: timestamp, user ID, role, method, path, response status.
- Admin actions (suspend user, resolve dispute) are logged to a tamper-evident audit trail.
- Logs shipped to CloudWatch / Datadog with 90-day retention.

## Vulnerability Disclosure

Report security vulnerabilities to `security@strplatform.com`. We follow a 90-day responsible disclosure policy.
