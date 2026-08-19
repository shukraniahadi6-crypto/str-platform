import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import { globalRateLimit } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

import authRouter from './api/v1/auth/router';
import usersRouter from './api/v1/users/router';
import jobsRouter from './api/v1/jobs/router';
import offersRouter from './api/v1/offers/router';
import trackingRouter from './api/v1/tracking/router';
import batchingRouter from './api/v1/batching/router';
import upcyclingRouter from './api/v1/upcycling/router';
import ledgerRouter from './api/v1/ledger/router';
import payoutsRouter from './api/v1/payouts/router';
import sdsRouter from './api/v1/sds/router';
import academyRouter from './api/v1/academy/router';
import adminRouter from './api/v1/admin/router';

const app = express();

// Security middleware
app.use(helmet());
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map((o) => o.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length > 0
    ? (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) cb(null, true);
        else cb(new Error('Not allowed by CORS'));
      }
    : false,
  credentials: true,
}));
app.use(compression());
app.use(globalRateLimit);

// Logging
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health checks
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.get('/db-health', async (_req, res, next) => {
  try {
    const { AppDataSource } = require('./core/database');
    await AppDataSource.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) { next(err); }
});

// API routes
const V1 = '/api/v1';
app.use(`${V1}/auth`, authRouter);
app.use(`${V1}/users`, usersRouter);
app.use(`${V1}/jobs`, jobsRouter);
app.use(`${V1}/offers`, offersRouter);
app.use(`${V1}/tracking`, trackingRouter);
app.use(`${V1}/batches`, batchingRouter);
app.use(`${V1}`, upcyclingRouter);
app.use(`${V1}/ledger`, ledgerRouter);
app.use(`${V1}/payouts`, payoutsRouter);
app.use(`${V1}/sds`, sdsRouter);
app.use(`${V1}/academy`, academyRouter);
app.use(`${V1}/admin`, adminRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ code: 'NOT_FOUND', message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

export default app;
