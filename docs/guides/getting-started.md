# Getting Started Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 15 with PostGIS extension
- Redis 7+
- Docker (optional, recommended)

## Quick Start (Docker)

```bash
git clone https://github.com/shukraniahadi6-crypto/str-platform
cd str-platform

cp .env.example .env
# Edit .env with your API keys

docker-compose up -d
```

Services available:
- API: `http://localhost:4000/api/v1`
- Swagger UI: `http://localhost:4000/api-docs`
- Redis: `localhost:6379`
- PostgreSQL: `localhost:5432`

## Environment Variables

```bash
# Server
PORT=4000
NODE_ENV=development
BASE_URL=http://localhost:4000

# Database
DATABASE_URL=******localhost:5432/str_platform

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_REFRESH_SECRET=another_secret_for_refresh_tokens

# Google APIs
GOOGLE_MAPS_SERVER_KEY=AIza...
GOOGLE_VISION_API_KEY=AIza...
# or
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=str-platform-uploads
AWS_REGION=us-east-1

# Email
SENDGRID_API_KEY=SG....
FROM_EMAIL=noreply@strplatform.com
```

## First API Call

### 1. Register an account

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "you@example.com",
    "password": "Str0ng!Pass",
    "name": "Your Name",
    "role": "customer"
  }'
```

### 2. Use the access token

```bash
export TOKEN="<accessToken from response>"

curl http://localhost:4000/api/v1/users/me \
  -H "Authorization: ******"
```

### 3. Open Swagger UI

Navigate to `http://localhost:4000/api-docs` and click **Authorize** to enter your token and explore all endpoints interactively.

## Next Steps

- [Authentication Guide](../api/auth/authentication.md)
- [Job Endpoints](../api/endpoints/job-endpoints.md)
- [WebSocket Events](../api/websocket/events.md)
- [TypeScript SDK](../api/sdks/typescript-sdk.md)
- [Postman Collection](../api/examples/postman-collection.json)
