import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { createAccessToken, createRefreshToken } from '../config/jwt';
import { env } from '../config/env';
import { Role } from '../middleware/auth';
import { AppError } from '../utils/errors';

export const signup = async (input: {
  name: string;
  email: string;
  password: string;
  role?: Role;
}): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
  const existing = await User.findOne({ where: { email: input.email.toLowerCase() } });
  if (existing) throw new AppError(409, 'Email already registered');

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash,
    role: input.role ?? 'customer',
  });

  const payload = { userId: user.id, role: user.role };
  return {
    accessToken: createAccessToken(payload),
    refreshToken: createRefreshToken(payload),
    user,
  };
};

export const login = async (email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  if (!user) throw new AppError(401, 'Invalid credentials');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AppError(401, 'Invalid credentials');

  const payload = { userId: user.id, role: user.role };
  return {
    accessToken: createAccessToken(payload),
    refreshToken: createRefreshToken(payload),
    user,
  };
};

export const refreshAccessToken = (refreshToken: string): string => {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string; role: Role };
    return createAccessToken({ userId: decoded.userId, role: decoded.role });
  } catch {
    throw new AppError(401, 'Invalid refresh token');
  }
};

export const changePassword = async (userId: string, currentPassword: string, nextPassword: string): Promise<void> => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError(404, 'User not found');
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) throw new AppError(401, 'Current password invalid');
  user.passwordHash = await bcrypt.hash(nextPassword, 10);
  await user.save();
};
