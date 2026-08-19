import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../core/database';
import { User, UserRole, AuthProvider } from '../models/User';
import { config } from '../core/config';
import { AuthError, ConflictError, NotFoundError } from '../utils/errors';
import type { JwtPayload } from '../middleware/auth';

const userRepo = () => AppDataSource.getRepository(User);

export async function registerUser(
  email: string,
  password: string,
  role: UserRole
): Promise<User> {
  const existing = await userRepo().findOne({ where: { email } });
  if (existing) throw new ConflictError('Email already registered');

  const password_hash = await bcrypt.hash(password, 12);
  const user = userRepo().create({
    email,
    password_hash,
    role,
    auth_provider: AuthProvider.LOCAL,
  });
  return userRepo().save(user);
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const user = await userRepo().findOne({
    where: { email },
    select: ['id', 'email', 'role', 'is_active', 'password_hash'],
  });

  if (!user || !user.password_hash) throw new AuthError('Invalid credentials');
  if (!user.is_active) throw new AuthError('Account is disabled');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new AuthError('Invalid credentials');

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
}

export function generateAccessToken(user: Pick<User, 'id' | 'email' | 'role'>): string {
  const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn } as jwt.SignOptions);
}

export function generateRefreshToken(user: Pick<User, 'id' | 'email' | 'role'>): string {
  const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
}

export async function refreshTokens(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  let payload: JwtPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AuthError('Invalid refresh token');
  }
  const user = await userRepo().findOne({ where: { id: payload.id } });
  if (!user || !user.is_active) throw new AuthError('User not found or disabled');

  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}
