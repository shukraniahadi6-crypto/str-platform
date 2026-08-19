import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type Role = 'customer' | 'courier' | 'admin';

export interface AuthPayload {
  userId: string;
  role: Role;
}

export interface AuthedRequest extends Request {
  user?: AuthPayload;
}

const extractToken = (header?: string, fallback?: string | string[]): string | null => {
  if (header && header.startsWith('Bearer ')) return header.slice('Bearer '.length);
  if (header) return header;
  if (typeof fallback === 'string') return fallback;
  return null;
};

export const requireAuth = (req: AuthedRequest, _res: Response, next: NextFunction): void => {
  const token = extractToken(req.headers.authorization, req.headers['x-access-token']);
  if (!token) {
    next({ statusCode: 401, message: 'Missing authentication token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload;
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch {
    next({ statusCode: 401, message: 'Invalid token' });
  }
};

export const requireRole = (...roles: Role[]) => {
  return (req: AuthedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next({ statusCode: 403, message: 'Insufficient permissions' });
      return;
    }
    next();
  };
};
