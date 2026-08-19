import dotenv from 'dotenv';

dotenv.config();

const asNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: asNumber(process.env.PORT, 8000),
  API_PREFIX: process.env.API_PREFIX ?? '/api/v1',
  DATABASE_URL: process.env.DATABASE_URL ?? ':memory:',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
  JWT_ACCESS_TTL: process.env.JWT_ACCESS_TTL ?? '15m',
  JWT_REFRESH_TTL: process.env.JWT_REFRESH_TTL ?? '7d',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  REDIS_URL: process.env.REDIS_URL,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: asNumber(process.env.SMTP_PORT, 1025),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  APP_BASE_URL: process.env.APP_BASE_URL ?? 'http://localhost:8000',
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL ?? 'http://localhost:5173',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  RATE_LIMIT_WINDOW_MS: asNumber(process.env.RATE_LIMIT_WINDOW_MS, 900000),
  RATE_LIMIT_MAX: asNumber(process.env.RATE_LIMIT_MAX, 200),
  PLATFORM_FEE_PERCENT: asNumber(process.env.PLATFORM_FEE_PERCENT, 10),
};
