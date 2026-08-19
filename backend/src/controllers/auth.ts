import { Response } from 'express';
import { login, refreshAccessToken, signup, changePassword } from '../services/auth';
import { AuthedRequest } from '../middleware/auth';
import { AppError } from '../utils/errors';

export const signupController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const result = await signup(req.body);
  res.status(201).json(result);
};

export const loginController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const result = await login(req.body.email, req.body.password);
  res.json(result);
};

export const refreshController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const accessToken = refreshAccessToken(req.body.refreshToken);
  res.json({ accessToken });
};

export const changePasswordController = async (req: AuthedRequest, res: Response): Promise<void> => {
  if (!req.user) throw new AppError(401, 'Unauthorized');
  await changePassword(req.user.userId, req.body.currentPassword, req.body.nextPassword);
  res.status(204).send();
};
