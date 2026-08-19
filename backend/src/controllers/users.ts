import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { deactivateUser, getProfile, listUsers, updateProfile } from '../services/user';

export const getMeController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const user = await getProfile(req.user!.userId);
  res.json(user);
};

export const updateMeController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const user = await updateProfile(req.user!.userId, req.body);
  res.json(user);
};

export const listUsersController = async (_req: AuthedRequest, res: Response): Promise<void> => {
  const users = await listUsers();
  res.json(users);
};

export const deactivateUserController = async (req: AuthedRequest, res: Response): Promise<void> => {
  await deactivateUser(String(req.params.userId));
  res.status(204).send();
};
