import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { onboardCourier, updateCourierAvailability } from '../services/courier';

export const onboardCourierController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const courier = await onboardCourier(req.user!.userId, req.body.serviceArea ?? 'default');
  res.status(201).json(courier);
};

export const updateAvailabilityController = async (req: AuthedRequest, res: Response): Promise<void> => {
  const courier = await updateCourierAvailability(req.user!.userId, Boolean(req.body.availability));
  res.json(courier);
};
