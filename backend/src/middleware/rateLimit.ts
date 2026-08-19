import rateLimit from 'express-rate-limit';
import { config } from '../core/config';

export const globalRateLimit = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests, please try again later',
  },
});

export const authRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
    message: 'Too many login attempts, please try again in 10 minutes',
  },
});

export const offerPingRateLimit = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => (req as any).user?.id || req.ip || 'unknown',
  message: {
    code: 'OFFER_RATE_LIMIT',
    message: 'Please wait before responding to another offer',
  },
});
