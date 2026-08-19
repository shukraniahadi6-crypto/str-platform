import { Courier, User } from '../models';
import { AppError } from '../utils/errors';

export const onboardCourier = async (userId: string, serviceArea: string): Promise<Courier> => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError(404, 'User not found');
  if (user.role !== 'courier') throw new AppError(400, 'User is not a courier');

  const existing = await Courier.findOne({ where: { userId } });
  if (existing) return existing;

  return Courier.create({ userId, serviceArea });
};

export const updateCourierAvailability = async (userId: string, availability: boolean): Promise<Courier> => {
  const courier = await Courier.findOne({ where: { userId } });
  if (!courier) throw new AppError(404, 'Courier profile not found');
  courier.availability = availability;
  await courier.save();
  return courier;
};
