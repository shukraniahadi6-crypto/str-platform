import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from './env';
import { AuthPayload } from '../middleware/auth';

const accessOptions: SignOptions = { expiresIn: env.JWT_ACCESS_TTL as SignOptions['expiresIn'] };
const refreshOptions: SignOptions = { expiresIn: env.JWT_REFRESH_TTL as SignOptions['expiresIn'] };

export const createAccessToken = (payload: AuthPayload): string =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, accessOptions);

export const createRefreshToken = (payload: AuthPayload): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, refreshOptions);
