# Sandbox & Testing Guide

## Sandbox Environment

The sandbox environment mirrors production but uses test payment methods and mock AI responses.

| Property | Value |
|---|---|
| Base URL | `https://sandbox-api.strplatform.com/api/v1` |
| WebSocket | `wss://sandbox-api.strplatform.com` |
| Stripe mode | Test mode (`sk_test_...`) |
| Vision API | Mock responses (no real Google API calls) |
| Emails | Captured; not sent to real addresses |

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Customer | `test-customer@str.dev` | `TestPass123!` |
| Courier | `test-courier@str.dev` | `TestPass123!` |
| Admin | `test-admin@str.dev` | `TestPass123!` |

> These accounts are reset daily at 00:00 UTC.

## Test Payment Methods (Stripe)

| Card Number | Description |
|---|---|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Declined |
| `4000 0025 0000 3155` | Requires authentication (3DS) |

Use any future expiry date and any 3-digit CVV.

## Mock Image URLs

Use these pre-loaded images to trigger predictable estimate results:

| URL | Expected Result |
|---|---|
| `https://sandbox.strplatform.com/test-images/sofa.jpg` | 1x Sofa, ~$120 |
| `https://sandbox.strplatform.com/test-images/yard-waste.jpg` | 5x Bags, ~$75 |
| `https://sandbox.strplatform.com/test-images/hazmat.jpg` | Battery detected, hazard level: medium |

## Running the Full DoorDash Flow

1. **Login as customer** → `POST /auth/login` with test-customer credentials
2. **Create estimate** → `POST /jobs/estimate` with mock image URL
3. **Create job** → `POST /jobs` with estimate ID
4. **Login as courier** (different session) → receive `offer:ping` via WebSocket
5. **Accept offer** → `POST /offers/:id/accept`
6. **Update location** → `POST /tracking/:jobId/location` (simulates en-route)
7. **Complete job** → `POST /tracking/:jobId/status` with `{ status: "completed" }`
8. **View green impact** → `GET /jobs/:jobId/green-impact`
9. **Request payout** → `POST /ledger/payout`

## Postman Collection Setup

1. Import `postman-collection.json` into Postman
2. Create an environment with variable `baseUrl = https://sandbox-api.strplatform.com/api/v1`
3. Run the **Auth → Login** request to auto-populate the `accessToken` variable
4. All subsequent requests use the token automatically

## Local Development Setup

```bash
# Clone and install
git clone https://github.com/shukraniahadi6-crypto/str-platform
cd str-platform

# Copy environment variables
cp .env.example .env

# Start services
docker-compose up -d postgres redis

# Run migrations
npm run db:migrate

# Seed test data
npm run db:seed

# Start API server
npm run dev
```

API available at `http://localhost:4000/api/v1`.  
Swagger UI at `http://localhost:4000/api-docs`.
