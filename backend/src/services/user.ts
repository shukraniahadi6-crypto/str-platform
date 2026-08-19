import { User } from '../models';
import { AppError } from '../utils/errors';

export const getProfile = async (userId: string): Promise<User> => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError(404, 'User not found');
  return user;
};

export const updateProfile = async (
  userId: string,
  updates: Partial<Pick<User, 'name' | 'phone' | 'address' | 'photo'>>,
): Promise<User> => {
  const user = await getProfile(userId);
  Object.assign(user, updates);
  await user.save();
  return user;
};

export const listUsers = async (): Promise<User[]> => User.findAll();

export const deactivateUser = async (userId: string): Promise<void> => {
  const user = await getProfile(userId);
  user.isActive = false;
  await user.save();
};
