# STR Backend

Production-oriented Node.js + Express backend for STR marketplace with TypeScript, Sequelize/PostgreSQL, auth, RBAC, jobs, bidding, payments, ledger, couriers, disputes, admin analytics, rate limiting, and tests.

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

## API base path

- `/api/v1`

## Core endpoints

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET/PATCH /users/me`
- `POST/GET /jobs`
- `POST /jobs/:jobId/offers`
- `POST /jobs/:jobId/offers/:bidId/accept`
- `POST /payments/charge`
- `POST /payments/:paymentId/refund`
- `GET /admin/analytics`

## Scripts

- `npm run dev` - start with hot reload
- `npm run build` - TypeScript compile
- `npm test` - Jest integration tests
- `npm run lint` - ESLint
