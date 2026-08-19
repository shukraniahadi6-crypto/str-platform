import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../../core/database';
import { User } from '../../../models/User';
import { UserProfile } from '../../../models/User';
import { DriverVerification } from '../../../models/User';
import { NotFoundError } from '../../../utils/errors';

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: req.user!.id },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundError('User');
    res.json(user);
  } catch (err) { next(err); }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profileRepo = AppDataSource.getRepository(UserProfile);
    let profile = await profileRepo.findOne({ where: { user_id: req.user!.id } });
    if (!profile) {
      profile = profileRepo.create({ user_id: req.user!.id, ...req.body });
    } else {
      Object.assign(profile, req.body);
    }
    await profileRepo.save(profile);
    res.json(profile);
  } catch (err) { next(err); }
}

export async function verifyDriver(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const repo = AppDataSource.getRepository(DriverVerification);
    let verification = await repo.findOne({ where: { user_id: req.user!.id } });
    if (!verification) {
      verification = repo.create({ user_id: req.user!.id, ...req.body });
    } else {
      Object.assign(verification, req.body);
      verification.status = 'SUBMITTED';
    }
    await repo.save(verification);
    res.json(verification);
  } catch (err) { next(err); }
}
