import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, refreshTokens } from '../../services/auth';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, role } = req.body;
    const user = await registerUser(email, password, role);
    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (err) { next(err); }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser(email, password);
    res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) { next(err); }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;
    const tokens = await refreshTokens(refreshToken);
    res.json(tokens);
  } catch (err) { next(err); }
}

export function logout(_req: Request, res: Response): void {
  // Token invalidation handled client-side; add Redis blacklist in production
  res.json({ message: 'Logged out successfully' });
}
