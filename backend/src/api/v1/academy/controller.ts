import { Request, Response, NextFunction } from 'express';
import { getCourses, completeCourse, getCourierBadges } from '../../../services/academy';

export async function listCourses(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const courses = await getCourses();
    res.json(courses);
  } catch (err) { next(err); }
}

export async function complete(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { answers } = req.body;
    const result = await completeCourse(req.user!.id, req.params.id, answers);
    res.json(result);
  } catch (err) { next(err); }
}

export async function getBadges(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const badges = await getCourierBadges(req.user!.id);
    res.json(badges);
  } catch (err) { next(err); }
}
