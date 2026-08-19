# STR Frontend (React + TypeScript)

Production-oriented frontend scaffold for STR marketplace with customer, courier, and admin dashboards.

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router
- Zustand (persisted preferences)
- React Hook Form + Zod validation
- Axios service layer

## Run locally
```bash
npm install
npm run dev
```

## Scripts
- `npm run dev` - start development server
- `npm run build` - typecheck and production build
- `npm run lint` - oxlint checks
- `npm run preview` - preview production build

## Environment
Copy `.env.example` to `.env` and update values.

## Implemented modules
- Reusable components: Button, Card, Modal, Input, FormField, Empty/Loading states
- Layout components: Header, Sidebar, Footer, DashboardLayout
- Customer pages: dashboard, create job, job details/history, pricing, payments, profile, settings
- Courier pages: dashboard, available/active jobs, earnings, profile, settings
- Admin pages: dashboard, users, jobs, transactions, disputes, content, health, reports
- Shared pages: home, auth, checkout, profile/settings, notifications, chat, reviews, 404/error
- Context/hooks/services/types/utils and mock data for development
